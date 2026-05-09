"""Spatially-masked continuous-time RNN for synapster.

Discrete-time CTRNN whose recurrent weights are masked by a binary structural
connectivity matrix derived from a connectome. This is the 'lite' version of
seRNN (Achterberg et al. 2023): the spatial prior comes from the mask, without
paying for distance/communicability regularization at training time.
"""

from __future__ import annotations

import numpy as np
import torch
import torch.nn as nn


def expand_sc_to_unit_mask(
    sc: np.ndarray,
    units_per_region: int,
    threshold: float = 0.0,
) -> torch.Tensor:
    """Expand a region-level SC matrix to a unit-level binary recurrent mask.

    Within-region blocks are forced to all-ones so units sharing a region are
    densely recurrently connected (ENIGMA SC has zero on the diagonal, which
    would otherwise kill all within-region recurrence).
    """
    R = sc.shape[0]
    if sc.shape != (R, R):
        raise ValueError(f"sc must be square, got {sc.shape}")
    region_connected = (sc > threshold).astype(np.float32)
    np.fill_diagonal(region_connected, 1.0)
    mask = np.kron(region_connected, np.ones((units_per_region, units_per_region), dtype=np.float32))
    return torch.from_numpy(mask)


class CTRNN(nn.Module):
    """Discrete-time CTRNN with a fixed connectome mask on recurrent weights.

    Dynamics:
        r_t      = phi(x_t)
        x_{t+1}  = (1 - alpha) * x_t + alpha * (W_rec_masked @ r_t + W_in @ u_t + stim_t + b)
        y_t      = W_out @ r_t
    where alpha = dt / tau.

    The `stim` input is the dashboard hook: per-unit current injected each
    timestep, computed dashboard-side from electrode positions and field falloff.
    """

    def __init__(
        self,
        input_dim: int,
        hidden_dim: int,
        output_dim: int,
        mask: torch.Tensor | None = None,
        dt: float = 20.0,
        tau: float = 100.0,
        nonlinearity: str = "tanh",
    ):
        super().__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim
        self.dt = dt
        self.tau = tau
        self.alpha = dt / tau

        if nonlinearity == "tanh":
            self.phi = torch.tanh
        elif nonlinearity == "relu":
            self.phi = torch.relu
        else:
            raise ValueError(f"unknown nonlinearity {nonlinearity!r}")

        self.W_in = nn.Linear(input_dim, hidden_dim, bias=False)
        self.W_rec = nn.Parameter(torch.empty(hidden_dim, hidden_dim))
        self.b = nn.Parameter(torch.zeros(hidden_dim))
        self.W_out = nn.Linear(hidden_dim, output_dim)

        nn.init.normal_(self.W_rec, mean=0.0, std=1.0 / hidden_dim ** 0.5)

        if mask is None:
            mask = torch.ones(hidden_dim, hidden_dim)
        if mask.shape != (hidden_dim, hidden_dim):
            raise ValueError(f"mask shape {tuple(mask.shape)} != ({hidden_dim}, {hidden_dim})")
        self.register_buffer("mask", mask.float())

    def masked_W(self) -> torch.Tensor:
        return self.W_rec * self.mask

    def forward(
        self,
        inputs: torch.Tensor,
        stim: torch.Tensor | None = None,
        x0: torch.Tensor | None = None,
    ) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Args:
            inputs: (T, B, input_dim) observations.
            stim:   per-unit stim current. None | (hidden_dim,) | (T, B, hidden_dim).
                    A 1D stim is broadcast across time and batch (constant injection).
            x0:     (B, hidden_dim) initial pre-activation state. Defaults to zeros.

        Returns:
            outputs: (T, B, output_dim)
            hidden:  (T, B, hidden_dim)  -- post-nonlinearity activations r_t,
                                            ready to dump into activations.json.
        """
        T, B, _ = inputs.shape
        device = inputs.device

        x = torch.zeros(B, self.hidden_dim, device=device) if x0 is None else x0

        if stim is None:
            stim_seq = None
        elif stim.ndim == 1:
            stim_seq = stim.to(device).view(1, 1, -1).expand(T, B, -1)
        elif stim.ndim == 3:
            stim_seq = stim.to(device)
        else:
            raise ValueError(f"stim must be 1D or 3D, got {stim.ndim}D")

        W = self.masked_W()
        outs, hids = [], []
        for t in range(T):
            r = self.phi(x)
            drive = self.W_in(inputs[t]) + r @ W.T + self.b
            if stim_seq is not None:
                drive = drive + stim_seq[t]
            x = (1.0 - self.alpha) * x + self.alpha * drive
            outs.append(self.W_out(r))
            hids.append(r)
        return torch.stack(outs, dim=0), torch.stack(hids, dim=0)

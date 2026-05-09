# --- one-time, on the LOGIN NODE (has internet) -----------------------

ssh <your-cluster>
git clone <repo> && cd synapster        # or: cd synapster && git pull
curl -fsSL https://pixi.sh/install.sh | bash
export PATH="$HOME/.pixi/bin:$PATH"      # add to ~/.bashrc too
pixi install -e hpc                      # resolves CUDA env (~5 min, downloads ~2GB)
pixi run -e hpc python scripts/setup_data.py

# expect:
#   [setup] torch...
#     torch=2.x.x  cuda=False  mps=False        <- cuda False is fine on login nodes
#   [setup] ENIGMA aparc SC matrix...
#     cached -> data/aparc_sc.npz  shape=(68, 68)  density=~30%
#   [setup] neurogym tasks...
#     PerceptualDecisionMaking-v0: obs=(10, 2, 3) labels=(10, 2)
#     DelayedMatchSample-v0: ...
#     ReadySetGo-v0: ...
#   [setup] done.
mkdir -p logs ctrnn/bundles

# --- submit one GPU job per task --------------------------------------
qsub -v TASK=PerceptualDecisionMaking-v0 scripts/train.pbs
qsub -v TASK=DelayedMatchSample-v0       scripts/train.pbs
qsub -v TASK=ReadySetGo-v0               scripts/train.pbs

# --- monitor ----------------------------------------------------------
qstat -u $USER
tail -f logs/synapster_train.o*          # PBS appends job id

# --- when finished ----------------------------------------------------
ls ctrnn/bundles/*/                      # each dir has weights.pt + model_bundle.json
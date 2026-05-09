        IEEE TRANSACTIONS ON NEURAL SYSTEMS AND REHABILITATION ENGINEERING, VOL. 32, 2024 3615

     Closed-Loop Deep Brain Stimulation With
Reinforcement Learning and Neural Simulation

        Chia-Hung Cho , Pin-Jui Huang , Meng-Chao Chen , and Chii-Wann Lin




                 Abstract — Deep Brain Stimulation (DBS) is effective for   P      I. INTRODUCTION
               movement disorders, particularly Parkinson’s disease (PD).                  ARKINSON’S disease (PD) is a chronic neurodegen-
                    However, a closed-loop DBS system using reinforcement      erative  disorder affecting   the central  nervous   system.
learning (RL) for automatic parameter tuning, offering It is cited as the second most prevalent neurodegenerative
enhanced energy efficiency and the effect of thalamus
restoration, is yet to be developed for clinical and com- disease after Alzheimer’s [1], affected over 10 million people
mercial applications. In this research, we instantiate a globally [2]. The degeneration of dopaminergic neurons in
basal ganglia-thalamic (BGT) model and design it as an the substantia nigra pars compacta (SNc) [3] leads to motor
interactive environment suitable for RL models. Four finely symptoms such as tremors, rigidity, bradykinesia, and postural
tuned RL agents based on different frameworks, namely instability [4], as well as non-motor symptoms including mood
Soft Actor-Critic (SAC), Twin Delayed Deep Deterministic
Policy Gradient (TD3), Proximal Policy Optimization (PPO), changes and swallowing difficulties. While Levodopa/L-dopa
and Advantage Actor-Critic (A2C), are established for fur- is effective in the early stages of PD, its benefits diminish
ther comparison. Within the implemented RL architectures, over time, leading to motor complications. High-frequency
the optimized TD3 demonstrates a significant 67% reduc- deep brain stimulation (DBS) (≥100 Hz) offers a promising
tion in average power dissipation when compared to the advanced treatment by regulating activity in targeted brain
open-loop system while preserving the normal response
of the simulated BGT circuitry. As a result, our method regions [5]. However, current clinical DBS systems operate
mitigates thalamic error responses under pathological con- in an open-loop regime, which results in higher power con-
ditions and prevents overstimulation. In summary, this sumption, subject-dependent [6], and adverse effects due to
study introduces a novel approach to implementing an overstimulation [7].
                 adaptive parameter-tuning closed-loop DBS system. Lever-           Closed-loop deep brain stimulation (cl-DBS) systems are
                 aging the advantages of TD3, our proposed approach holds
                  significant promise for advancing the integration of RL       capable of regulating stimulation parameters based on feed-
              applications into DBS systems, ultimately optimizing thera-         back signals and control strateies. Optimizing the cl-DBS
    peutic effects in future clinical trials.                               algorithm   remains crucial  for  addressing  the post-surgical
  Index Terms— Basal ganglia-thalamic (BGT) network, challenge of DBS device [8]. While machine learning (ML)
closed-loop deep brain stimulation (cl-DBS), Parkinson’s techniques are extensively used in the analysis and prediction
    disease (PD), reinforcement learning (RL).                                      of complex systems, deploying new generations of cl-DBS
        algorithms in live environments remains challenging due to
  Received 16 March 2024; revised 18 August 2024; accepted the difficulty of conducting experimentation. Thus, the cl-DBS
16 September 2024. Date of publication 20 September 2024; date of
current version 27 September 2024. This work was supported by the technique proposed in this study uses physical neural modeling
Minister of Science and Technology Council, Taiwan, under Grant MOST to mimic the fundamental dynamics of the electrophysiological
    111-2221-E-002-079-MY3. (Corresponding author: Chii-Wann Lin.)          alterations associated  with PD,    allowing  the algorithm  to
  Chia-Hung Cho is with the Department of Biomedical Engineering,
National Taiwan University, Taipei 100, Taiwan (e-mail: r09528018@ closely replicate the live brain environment and allowing
    g.ntu.edu.tw).                                                          extensive and harmless testing.
          Pin-Jui Huang is with the Graduate Degree Program of Artificial   In conjunction     with the    establishment  of  this environ-
     Intelligence, National Yang Ming Chiao Tung University, Hsinchu 300,
    Taiwan (e-mail: i309505013.eic09g@nctu.edu.tw).                              ment, development of robust, real-time adaptive algorithms
         Meng-Chao Chen is with the Department of Biomedical Engineering,    to enhance patient-specific adaptability and address long-term
National Taiwan University, Taipei 100, Taiwan, and also with the Depart-     changes in neurological conditions is essential for advancing
  ment of Neurosurgery, China Medical University Hospital, Taipei Branch,
    Taipei 100, Taiwan (e-mail: neuronxx@gmail.com).                                DBS therapy. Reinforcement learning (RL) has emerged as
          Chii-Wann Lin is with the Department of Biomedical Engineering,          a powerful technique that enables agents to perceive and
 National Taiwan University, Taipei 100, Taiwan, also with the Biomedical       interpret interactive environments, followed by determining
       Technology and Device Laboratories, Industrial Technology Research
  Institute, Hsinchu 310, Taiwan, and also with the Center for Artificial        actions to achieve the most desirable outcomes by maximiz-
    Intelligence Research, University of Tsukuba, Tsukuba 305-8577, Japan        ing rewards. In other words, integrating RL techniques can
    (e-mail: cwlinx@ntu.edu.tw).                                              facilitate precise, safe (with constrained action range), and
        This article has supplementary downloadable material available at
     https://doi.org/10.1109/TNSRE.2024.3465243, provided by the authors.       personalized adjustments to stimulation parameters, thereby
    Digital Object Identifier 10.1109/TNSRE.2024.3465243                     enhancing the effectiveness and reliability of cl-DBS systems.

                      © 2024 The Authors. This work is licensed under a Creative Commons Attribution 4.0 License.
                                    For more information, see https://creativecommons.org/licenses/by/4.0/

    3616    IEEE TRANSACTIONS ON NEURAL SYSTEMS AND REHABILITATION ENGINEERING, VOL. 32, 2024










        Fig. 2. Illustration of the simulated regions (purple box) and the related
        currents. Purple ovals are the four neuron types in the basal ganglia-
        thalamus (BGT) network, containing 10 neurons in each nucleus.
Fig. 1. The overall architecture of this study. The solid blue lines Excitatory inputs are represented by black arrows, including ⃝1 input
represent what we will implement in this work, whereas the dashed from the sensorimotor cortex (ISM), ⃝2 constant bias current, Iapp(STN),
green lines represent a practical direction for the future. Both present to STN, ⃝3 constant bias current, Iapp(GPe), from Stiatum to GPe, ⃝4
    the closed-loop characteristics.                                  constant bias current, Iapp(GPi), from Stiatum to GPi, ⃝5 synaptic current
                                                                           (Ifrom STN to GPe (ISTN→GPe), and ⃝6 synaptic current from STN to GPi
             Based on a review of current literatures, RL techniques have    STN→GPi). Inhibitory inputs are indicated by gray arrows, namely ⃝7
        synaptic current from GPi to TH (IGPi→TH), ⃝8 synaptic current from
been increasingly utilized for the treatment of PD via DBS. GPe to STN (ISTN), ⃝9 synaptic current from GPe to GPi (IGPe→GPi),
        and ⃝
    Lu et al. [9] incorporated a Cerebellar Model Articulation Con-           10  synaptic  current from GPe to itself   (IGPe→GPe). Refer    to
    troller (CMAC) into an actor-critic RL framework, reducing               Equation (1),(2), (3).
    energy consumption by 63.3% compared to open-loop DBS.                               Gradient (TD3), Proximal Policy Optimization (PPO), and
    Krylov et al. [10] used Proximal Policy Optimization (PPO) to                   Advantage Actor-Critic (A2C). Results demonstrate the effec-
    train RL agents for suppressing synchronous neuronal activity                   tiveness and superiority of our TD3-based method in terms of
    in models of various oscillations. Gao et al. [11] applied               power efficiency and mitigation of error response.
    a Markov decision process (MDP) model and convolutional
    neural  networks      (CNNs)      to  alleviate PD symptoms      with                      II. METHODS
    an average stimulation frequency of 45 Hz. Agarwal et al.                A. BGT Network Model Simulation
    [12] used Twin Delayed Deep Deterministic Policy Gradients                             We construct the interactive BGT network based on the
(TD3) to suppress neuronal synchronization with reduced Rubin-Terman model [15], [16], [17] focusing on key neu-
power consumption, comparing it favorably against other ral nuclei within the basal ganglia (BG). The subthalamic
RL algorithms. All these RL models are trained exclusively nucleus (STN), external globus pallidus (GPe), internal globus
on pathological (PD state) data, focusing on the alleviation pallidus (GPi), and thalamus (TH) relay neurons are crucial
of pathological neuronal activity. However, overlooking the components in our simulation. Employing conductance-based
potential coexistence of normal states during training might models, we simulate these four nuclei, interconnected through
lead to several issues. Specifically, the model might misin- inhibitory and excitatory synapses (refer to Fig. 2.) Each
terpret normal data as pathological, resulting in inappropriate nucleus comprises 10 neurons to balance fidelity and com-
stimulation, side effects, suboptimal performance, increased putational efficiency. The parameters and ordinary differential
false positives, and potential risks to patient safety. Addi- equations (ODE) of this biophysics model are originated
tionally, within the above articles, feature extraction methods from the work by So et al. [17] and are implemented in
relying on machine learning methods lack explicit guidance Python. Consult the supplementary material for comprehen-
on their application to extracellular electrophysiological sig- sive understanding of equations and parameters. The BGT
nals, such as electroencephalograms (EEGs) and local field network simulation encompasses both normal/healthy and
    potentials (LFPs).                                                            PD/pathological conditions for better RL model generalization.
    In our   study,       we wrapped      the  Basal     Ganglia-Thalamic    The membrane potential (v
    (BGT) network that simulate brain dynamics in both normal                                                     a) of each neuron obeys Kirch-
    and pathological states into the Gymnasium [13] environment                    hoff’s current balance law, where the subscript a denotes the
    for developing and comparing RL methods, as depicted in                          sub-region, and is presented mainly in differential form as
    Fig. 1. We prioritize using     well-established  and       validated    follows:dv
    feature extraction methods for biomarker signals (refer to               Cm   dtST N  = − IL −IN a − IK −IT −ICa − I AH P
    Section II-B) to ensure their effectiveness in electrophysiologi-                      − I
    cal signals during deployment. RL models will explore the best                         G Pe→ST N + Iapp(ST N ) + I D B S,                (1)
    strategy for regulating the frequency and amplitude parameters           Cm dvG Pe/ⁱ = − I    I    −   −I −     − I
    of DBS. Four mainstream on-policy and off-policy [14] RL                     dt            L − N a   IK T      ICa   AH P
    frameworks are encompassed in the comparison, namely, Soft                        − IST N→G Pe/ i − IG Pe→G Pe/ i + Iapp(G Pe/i),
    Actor-Critic (SAC), Twin Delayed Deep Deterministic Policy                                                                               (2)

    CHO et al.: CLOSED-LOOP DBS WITH RL AND NEURAL SIMULATION    3617


    Cm dtvT H  = − IL −IN a − IK −IT −IG Pi→T H + IS M .      (3)

  In the neuronal models, the term Cm dv/dt represents the
capacitive current responsible for charging the specific mem-
brane capacitor Cm in STN, GPi, GPe, and TH-type neurons.
Currents IL , IN a, IK , IT , ICa , I AH P correspond to leak,
sodium, potassium, low-threshold calcium, high-threshold
calcium, and voltage-independent “after hypopolarization” Fig. 3. Illustration of the biphasic, charge-balanced, symmetric DBS
potassium intrinsic ion channel currents. These intrinsic cur- pulses we applied throughout our simulation work.
rents are characterized by gating variables that dictate the
activation/opening and inactivation/blocking of the channels. excitatory input from two STN neurons and inhibitory input
External currents, including I D B S, IS M , Iα→β , and Iapp (refer from two other GPe neurons. Finally, each GPi cell projects
    to Fig. 2), influence the subsequent elements of the model.      to one TH cell. In other words, the effect of the overall
  The term I D B S in (1) indicates that the stimulation wave- BG network and external DBS is propagated to TH through
form is directly transmitted to the STN region by the DBS GPi, i.e., IG Pi→T H , allowing us to evaluate the efficacy of
stimulator. Due to safety concerns, I D B S is a symmetric, stimulation through the quantified EI.
    charge-balanced biphasic pulse,  where  anodic    stimulation    Iapp   denotes the constant external applied/bias currents in
comes first and follows the cathodic stimulation with no STN, GPe, and GPi nuclei, which is the main difference
interphase delay (refer to Fig. 3). Maintaining “charge- between the healthy and PD states in simulation. Based on
balanced” helps prevent undesirable faradic reactions at the the PD etiology, decreased Iapp level elucidates the effect of
electrode-tissue interface over time, which can pose a risk to insufficient dopamine secretion by SNc since currents from
brain tissue. The pulse width is fixed at 60 μs in consideration other brain regions or striatum are correspondingly lessened.
of the observed phenomenon that the overall therapeutic We apply additional noise (refer to supplementary material)
window decreases with an increase in the pulse width [18]. to the Iapp of GPe neurons to simulate the variability in this
Furthermore, fixed pulse width helps minimize charge injec- variable due to different PD salience in the current circuit.
tion and reduce power consumption [19]. The trained RL
agent will intervene in the regulation of additional stimulation B. Biomarker Selection
    parameters, such as frequency and amplitude.                        In the BGT network, we call for a discriminative signal as
  TH neurons do not exhibit intrinsic firing properties with- the environmental output. Varied relay properties in the TH
out sensorimotor input (IS M ). IS M is modeled as a series neuron are influenced by the IG Pi→T H synaptic current that
of anodal, monophasic current pulses with an amplitude of carries distinct signal representations. I
         3.5μA/cm2 and a pulse duration of 5ms. The instantaneous        G Pi→T H
        of: IG Pi→T H = gG Pi→T H [vT H − EG Pi→T H ] ∑ is comprisedS
frequencies of this pulse conform to a gamma distribution with gG Pi→T H is the maximal synaptic conductance, S G Pi , where
       an average rate of 14 Hz and a variation of 0.2 to emulate        G Pi                                              denotes
the irregular nature of incoming signals from the cortex. the synaptic variable from the presynaptic structure GPi, and
As a role of a relay station, TH cells must respond faithfully EG Pi→T H is the reversal potential across synapses. Among
and promptly to periodic input with a single action potential these components, we refer to the synaptic variable-based
(AP) [17]. Subsequently, this signal will be transmitted to control strategy proposed by Gorzelic et al. [21], setting SG Pi
the brainstem and spinal cord to facilitate the execution of as a biomarker signal. We further examine the correlation
motions. Relay error exhibits a high correlation with motor between the SG Pi signals and TH membrane potentials in three
symptoms, as indicated in [20]. It functions as a quantitative different states in Section III-A.
metric for assessing the degree of PD pathology in our study.
We quantify the degree of response error using the Error Index C. Problem Formulation
    (EI), which is formalized as:                                         We wrapped the BGT network into a customized interactive
                   E I = Nerror .                             (4)    environment based on Gymnasium ( [13], [22]) architecture,
                                 NS M                                devising a tailored interface with appropriate action space,
                                                                     state space, reward function, episode configuration, and step
  According to the equation, EI is defined as the number of error    length. As an initial condition, the environment randomly
    transmissions (Nerror ) over the total number of sensorimotor    assigns a state from healthy and PD when an episode starts,
      inputs ( NS M ). It depends upon the average of all (10) TH    mimicking the irregular occurrence of PD.
     channels/neurons. Higher EI indicates a greater dominance of          1) Action: Action space comprises the DBS frequency and
    PD in the current circuit and lower relay reliability (RR) of    amplitude value in a total dimension of 2. These values serve
    TH neurons.                                                      as the output of the RL model, while the input to the BGT
  Currents in the form of Iα→β stand for synaptic inhibitory environment. Studies have evaluated the effects of variation in
or excitatory current from presynaptic nucleus α (α ∈ {STN, the DBS parameters and suggested suitable ranges ( [18], [19],
GPe, GPi}) to postsynaptic nucleus β (β ∈ {GPe, GPi, TH}). [23], [24]). Both frequency and amplitude are continuous vari-
According to [17], each STN neuron receives inhibitory input ables within the range of 100∼185 Hz and 0∼5000 μA/cm2,
from two GPe neurons. Each GPe or GPi neuron receives while the pulse width remains fixed at 60 μs. However, these

  3618    IEEE TRANSACTIONS ON NEURAL SYSTEMS AND REHABILITATION ENGINEERING, VOL. 32, 2024


  actions will be set in a normalized range                [−1, 1], aligning                      independence and ease of implementation, make it a
                 with the common practice in many RL algorithms that utilize                 preferable choice. Lower sample entropy values indicate
            a Gaussian distribution (initially centered at 0 with a standard             a higher degree of self-similarity in the dataset, reflect-
                deviation of 1) for continuous actions. The actual frequency                   ing lower complexity and irregularity, which is often
                and amplitude value will be denormalized back to the desired                     observed in PD cases. In the context of subthalamic
  range within the BGT environment, by using:                                              nucleus-local field potential (STN-LFP) signals, neuronal
               actual value = (normalized + 1) × (max − min) + min .     (5)               entropy exhibited a progressive increase with the rise of
                           2                                                                 DBS amplitude, coinciding with the suppression of beta-
   2) State:                The state space comprises the feature extraction               band oscillation—a characteristic that can be interpreted
  value extracted from the biomarker signal               SG Pi (as detailed          as an inverse indicator [29].
                in Section II-B ) in a total dimension of 6. Contrary to the          Formula defined as:    C(m + 1, r )
                   action space, state values are the input to the RL model,              SampEn(m, r, N ) = − ln      ,                        (11)
                   while the output of the BGT environment. Furthermore, all                                   C(m, r )
                 features were normalized by the max–min normalization tech-                where N is the data length, m is the embedding dimension
             nique. Extracellular-based feature extraction techniques are as          (default = 2), r    is the radius of the neighborhood (default
  follows:                                                                                 = 0.2 × std(xi )), C(m + 1, r ) is the number of embedded
   •  Signal standard deviation.                                                      vectors of length            m + 1 having a Chebyshev distance
   •                 Hjorth Parameters: Hjorth Parameters, comprising activ-          inferior to r , and C(m, r )         is the number of embedded
                  ity, mobility, and complexity, offer a statistical charac-                vectors of length m having a Chebyshev distance inferior
                  terization of time-domain signals. Initially developed for              to r . Sample entropy measures the likelihood that vectors
                      EEG analysis due to low computational complexity [25],              of length m that are close to each other will remain close
                        they have proven effective in enhancing PD diagnosis          when their length increases to m + 1.
                   with an accuracy of up to 89.3% [26]. Calculation defined           To ensure the applicability of these feature extraction meth-
      as:                                                                       ods   in real data,    we validated them in the EEG          dataset
          Activity:                    A = 1 ∑N (x        − x   2,       (6)                from [30] using channels located above the primary motor
                                         N           i        )                             cortex (C3, FC3, CP3, C5, FC4, C4, C6, CP4). The diagram
                                         √ i=1                                  is presented in the Results III-B.
          Mobility: M =                      A( d xⁱ )                          3) Step Length:             The step length significantly influences
                                            Adt         ,                (7)            the time resolution of the action and information content of
                                                                                      the state space, presenting a trade-off. A shorter step length
          Complexity: C = M ( d xⁱ )                                                 provides higher resolution in the control action space and more
                                          Mdt    ,                       (8)                  dynamic DBS waveforms. However, this comes at the cost
   where xi represents the signal values, x is the mean of of potentially diminishing the meaningfulness of state signals
      the signal, and N     is the number of samples.                                      to the RL agent and limiting the observation of long-term
• Beta Band Power: Increasing evidence indicates a correla- features. In our study, we selected a 100-millisecond (ms) step
   tion between beta-frequency band (12)–30 Hz) oscillation length, guaranteeing the occurrence of at least one ISM input
   powers in the LFPs recorded in the STN of PD patients pulse at 14 Hz.
                       and motor impairments such as bradykinesia and rigid-               4) Episode Termination Prerequisites: Determining when an
                   ity [27]. PD patients exhibit elevated beta power spectra               episode is done in RL environment depends on the specific
                        in both STN and GPi neurons, which can be suppressed               context and goals of the task. For a DBS parameter tuning
                     by adequate stimulation amplitude or medication. Calcu-    environment, the following criteria should be met:
      lation defined as:                                                           •  EI of the current state is zero ( no error response in current
                      Sx ( f ) = 1 |X ( f )|,                            (9)       •  state).
          ∫T     f                                                                 •  The average EI is below 0.1.
          P     high                                                                               The average beta band power is suppressed below a
                           β   =    flow  Sx ( f )      d f ,           (10)          threshold value (Tβ ).
                                                                                         Satisfying the above demands will lead to an episode termi-
               where X ( f ) is the Fourier transform of the filtered signal    nation, indicating convergence of the episode.
      xβ ,    T is the total time duration of the signal,           Sx ( f )    5) Reward:               In our design, the reward function combined
   is the power spectral density of xβ , flow and fhigh are different aspects into a single, balanced reward function as
   cutoff frequencies for the bandpass filter, which is 12 and follows:
      30 in our case, and finally the Pβ            is the desired beta-band        Reward = R(t) = α · r
      power.                                                                              1 + β · r2 + γ · r3 + δ · r4,                         (12)
• Sample Entropy (SampEn): SampEn has proven effective where r1, r2, r3, r4 is respectively identified as “improve-
   in evaluating the complexity of physiological time-series ment score,” “energy consumption,” “side effect score,” and
   signals and diagnosing disease states [28]. Its advantages “compensation score.” Positive weighting coefficients (α, δ)
   over approximate entropy (ApEn), such as data length imply encouragement, while negatives (β, γ ) are for penalty.

    CHO et al.: CLOSED-LOOP DBS WITH RL AND NEURAL SIMULATION    3619


Additionally, each component of the reward function is scaled critic networks, delayed updates of the actor, and action
in the range [0, 1] to avoid skewed learning of the RL model. noise regularization. It is an off-policy algorithm, similar to
  Crafting the improvement score based on reliability com- SAC, and it leverages the advantages of a replay buffer.
ponents (EI) can be a beneficial approach, considering that This approach enhances data efficiency, diminishes correla-
reducing thalamus EI is one of the primary objectives of tions between consecutive samples, facilitates efficient batch
this task. We define the improvement degree of EI before learning, and enables the algorithm to revisit and learn from
( E It−1) and after (E It ) the action (I D B S(t)) as the first reward past experiences. The critic networks are updated to minimize
    component with α = 1.2:                                                 the temporal difference (TD) between the predicted Q-values
                      r1 = E It−1 − E It .                          (13)    and the target values, in both TD3 and SAC.
        PPO is an on-policy algorithm, meaning it learns from the
  Next, the energy consumption is calculated using the root data collected by the current policy. The rollout buffer stores
mean square of I D B S(t), where the frequency and amplitude on-policy experiences sampled from the most recent policy
    components are actions output from the RL model, as:                    to ensure that the learning process remains focused on the
                      r2 = √I R M S                                         current policy. It involves replacing the intricate constrained
                                  1 ∫     T                                 optimization step in the Trust Region Policy Optimization
                      I R M S =   T     I D B S2   (t)dt ,          (14)    (TRPO [37]) with a simpler surrogate objective function that
                                      0                                     incorporates advantage, a clipping mechanism, and the entropy
          where T denotes the duration of the I D B S stimulation on STN    of the policy.
            neurons, and weighting factor β = −0.8. r2 is further scaled             A2C is an on-policy algorithm that integrates policy and
by the highest possible value of I R M S, which is based on the value learning, ensuring simplicity and stability in training
upper bound of DBS frequency: 185 Hz and amplitude: 5000 with synchronous updates. It directly optimizes the policy
    μA/cm2.                                                                 using the advantage function with the value function baseline,
  To expedite the agent to achieve the episode termination represented as the difference between the estimated value
goal without intentionally prolonging the episode, we design function and the value of the current state. Notably, A2C does
the “side effect score” as the EI of the current state with γ = not explicitly enforce a trust region constraint, allowing for
    −0.5:                                                                   potentially larger policy updates.
                          r3 = E It                                 (15)                          III. RESULTS
              Follow with a compensation value for switching off the DBS    A. Environment Simulation Results
          (zero amplitude) in healthy states for encouragement of energy          Fig. 4 report the voltage traces of TH neuron, the synaptic
    conservation, with weighting factor δ = 0.5:                            signal,      SG Pi , and its scalogram in normal, PD without DBS,
        r4 = { 1, if                r1 ∩ r2 ∩ r3 = 0                (16)    and PD with 130 Hz DBS condition. Scalograms are calculated
                          0,           otherwise.                           through continuous wavelet transform with the Morse wavelet.
        During PD state, substantial synchronous in the GPi nuclei
Jointly, the final reward function is normalized as: R′(t) = is sufficient to affect thalamic activity through large syn-
    R(t)/(α + β + γ + δ) within [−1, 1] to stabilize training.              chronous oscillations/fluctuations in the SG Pi signal, resulting
                                                                            in a higher EI compared to other conditions. There is also
    D. RL Actor-Critic Frameworks Implementation                            a substantial difference between the pathological state and
  In this study, we evaluate the BGT environment using the the others in the scalogram, presenting the frequency band
Soft Actor-Critic (SAC [31]), Twin Delayed Deep Determinis- (10)–20 Hz) of the synchronous neuronal activity. The applied
tic Policy Gradient (TD3 [32]), Proximal Policy Optimization DBS could suppress the oscillating characteristic of SG Pi ,
(PPO [33]), and Advantage Actor-Critic (A2C [34]) frame- exhibiting a reduction in the error response in TH neurons
works. All models share the same critic and actor architecture, to IS M and the band power.
implemented using PyTorch [35].
  SAC is an off-policy actor-critic algorithm that incorporates B. Feature Verification
    an entropy     regularization  term   for     exploration encourage-            Fig. 5 demonstrates the results of the feature extraction
ment. Its objective function combines expected return and (mentioned in II-C.2) for both synaptic signal (SG Pi ) from the
policy distribution entropy, preventing excessive determin- BGT environment and the EEG dataset from [30] across PD
ism for improved exploration. The learnable temperature and Healthy Control (HC) participants. In the 64-channel mon-
parameter (α), updated through gradient descent, controls tage of EEG electrodes, the channels most commonly related
entropy regularization strength. Critic and target critic net- to PD for further signal analysis are typically those covering
works guide policy optimization, with soft updates ensuring the motor cortex and supplementary motor areas. In total, eight
gradual adaptation. The actor-network employs a Gaussian channels are selected, including C3, FC3, CP3, C5 within the
policy parameterized by the mean and standard deviation for left central lobe, and C4, FC4, C6, CP4 within the right central
    stochasticity.                                                          lobe. Features are normalized by the max–min normalization
              TD3 addresses issues in deep deterministic policy gradient    technique. The observed consistency in trends between PD and
               (DDPG [36]) by reducing the overestimation bias with twin    HC states suggests promising potential for their application in

    3620    IEEE TRANSACTIONS ON NEURAL SYSTEMS AND REHABILITATION ENGINEERING, VOL. 32, 2024










    Fig. 5. Observations on the effect of feature extraction in (A) synaptic
    signals and (B) EEG signals. Eight channels (C3, FC3, CP3, C5, FC4,
    C4, C6, CP4) are selected from the Iowa dataset in [30] for feature
    verification.










    Fig. 6. Pearson correlation coefficients between each feature and the
    error index (EI) of the TH neurons.






    Fig. 4.      Thalamus voltage traces, synaptic input signals from GPi to
    TH (SGPi), and scalogram within the beta band in three conditions:
    (A) normal/healthy (EI=0.0), (B) PD without DBS (EI=0.5), and (C) PD
    with DBS conditions(EI=0.0). ISM    inputs are highlighted in red pulse.
    +: represents a “bursting” error response (generating more than one
    AP); *: represents a “missing” error response (TH neuron signal does
    not constitute an AP). There is a bright band (high magnitude/power)
    between 10–20 Hz in (B) PD condition, which is the so-called beta band
    oscillation. The oscillation is obscure in (A) healthy conditions and is
    eliminated with biphasic DBS in (C).

    subsequent agent deployments. Furthermore, the correlation               Fig. 7. The   reward curve  of the RL models across       different
between each feature and the EI of TH neurons is shown architectures, including Soft Actor-Critic (SAC), Twin Delayed Deep
in Fig. 6. All features suggested highly correlation with the Deterministic Policy Gradient (TD3), Proximal Policy Optimization
        (PPO), and Advantage Actor-Critic (A2C). The x-axis represents the
EI of TH neurons, allowing the biomarker SG Pi to be nicely training steps, while the y-axis shows the average rollout reward
    represented.                                                             obtained by the RL models. The shaded regions around each curve
                                                                             represent the ± 1 standard deviation of the rewards, reflecting the
                                                                             variability in the model’s performance across training sessions.

C. RL Experimental Results
   The reward curves in Fig. 7 for each architecture portray second-highest peak reward. PPO (orange line) and A2C (red
varying levels of performance over each training session. The line) exhibit nearly identical convergence rewards, with A2C
plot reveals that the TD3 architecture (green line) converges securing a marginally faster convergence time than PPO, indi-
the fastest, stabilizing after just 400 steps, and achieves the cating a modest performance advantage. The shaded regions
highest reward value, demonstrating its efficiency and effec- surrounding each curve represent the ± 1 standard deviation
tiveness in optimizing stimulation parameters. The SAC model of the rewards, providing insight into the variability and con-
(blue line) converges at a slightly slower rate, attaining the sistency of each model’s performance across episodes. These

    CHO et al.: CLOSED-LOOP DBS WITH RL AND NEURAL SIMULATION    3621










Fig. 8. Control strategy in the PD state by (A) SAC, (B) TD3, (C) PPO, and (D) A2C RL agents. Stimulation is activated after 1000 milliseconds.
Each subplot includes the biomarker signal (SGPi), action signal (IDBS), thalamus action potentials, sensorimotor input (ISM), and the scalogram of
the SGPi signal in the beta frequency band, from top to bottom.

areas emphasize the stability of TD3’s superior performance TABLE I
and the slightly greater variability observed in SAC. EVALUATION METRICS FOR ALL TRAINED RL AGENTS, OPEN-LOOP
  Fig. 8 and Fig. 9 illustrate the control strategies performed DBS (OL-DBS), WITHOUT DBS IN BOTH PD AND
by agents trained using the SAC, TD3, PPO, and A2C RL HEALTHY CONTROL CONDITIONS
frameworks in the PD and healthy state. DBS is activated after
1000 milliseconds (ms). Each subplot includes the biomarker
signal (SG Pi ), action signal (I D B S), thalamus action potentials
in response to sensorimotor input (IS M ), and the scalogram of
the SG Pi signal in the beta frequency band. Table I summa-
rizes the quantitative reductions in percentage and average EI
for each framework compared to ol-DBS.
  In the PD state, the agents are anticipated to administer opti-
mal stimulation based on signal features, effectively mitigating
the existing pathology without undue energy expenditure.
Fig. 8 reveals that both SAC and TD3 agents manifest actions
with low variability, contributing to significant corrections a stable output with small amplitude, and the application of
in thalamic relay reliability (both with EI values of 0) and stimulation does not result in side effects or an increase in
the suppression of oscillations in the beta frequency band. EI. Remarkably, under the TD3 agent’s control, it effectively
Notably, TD3 exhibits superior energy efficiency compared modulates the amplitude to zero, indicating the cessation
to SAC. However, under the parameter control of the (on- of stimulation. This control strategy demonstrates significant
policy) PPO and A2C agents, the resulting actions show effectiveness. PPO and A2C strategies typically show higher
increased variability, and the parameter adjustments lead to variability. Although they exhibit stability in mild oscillations
less effective suppression in the PD state. Due to the limited in the healthy state, a slightly increased power in the beta
suppression effect on the beta band oscillation, a distinct bright frequency band is observed on the scalogram compared to the
band continues to appear in the scalogram after 1000 ms. former two strategies. Their energy efficiency is slightly lower,
Quantitatively, the EI values are notably higher, reaching with values of 78% and 77%, respectively, subsequent to TD3.
0.15 and 0.23, respectively, as shown in Table I. Table I shows the quantitative comparison of four trained
  In the healthy control state, guided by the reward design, the RL agents, open-loop DBS, and the case without DBS inter-
agents are expected to minimize or deactivate stimulation to vention in both PD and healthy control states. In ol-DBS
conserve energy without inducing side effects. SAC maintains regime, we assume I D B S´ (t) delivers pulses with frequency

    3622    IEEE TRANSACTIONS ON NEURAL SYSTEMS AND REHABILITATION ENGINEERING, VOL. 32, 2024










Fig. 9. Control strategy in the healthy control state by (A) SAC, (B) TD3, (C) PPO, and (D) A2C RL agents. Stimulation is activated after
1000 milliseconds. Each subplot includes the biomarker signal (SGPi), action signal (IDBS), thalamus action potentials, sensorimotor input (ISM),
and the scalogram of the SGPi signal in the beta frequency band, from top to bottom.

of 130 Hz and amplitude of 2500 μA/cm2. The reduced amplitude of zero. After 200 ms, with the onset of PD at
percentage is calculated by: 1 − (I R M Sˆ /I R M S´ ) × 100%, where 200 ms and 400 ms, a prominent bright beta band appears
I R M Sˆ is for root mean square of target I D B S(t), and I R M S´ is in the SG Pi scalogram, accompanied by bursting error in the
for the corresponding value in ol-DBS. Notably, the elevation TH neurons. The model then applies stimulation to effec-
of EI in ol-DBS regime under healthy state highlights potential tively suppress beta band power between 300 and 400 ms.
concerns related to overstimulation and its associated side The normal state reemerges at 600 ms, leading to a slight
effects, while the restorative effect is constrained in the PD application of DBS amplitude. A new bright beta band appears
    state.                                                                       between 800 and 1000 ms, prompting the RL model to take
               In summary, off-policy approaches exhibit better stability  an additional step to better detect the PD occurrence. DBS is
    in generating actions for this task and demonstrate superior            then applied again after 1000 ms to suppress this beta band.
    restoration capability compared to on-policy agents. However,             This showcases the model’s capability to adapt and respond
    SAC tends to employ a more greedy strategy, resulting in               to dynamic conditions in a continuous, real-world setting.
    relatively higher energy expenditure. Among the off-policy
    frameworks, PPO slightly outperforms A2C, with its control                 IV. DISCUSSION
    strategy resembling SAC in the healthy state. TD3 stands                       Our study demonstrated the improvement of cl-DBS sys-
    out in both scenarios across all frameworks: in the PD state,          tems via RL-based architectures compared to existing systems.
    it effectively restores thalamic relay reliability, suppresses beta       This finding underscores the potential of RL to offer more
    frequency oscillations, and maintains efficient energy usage;        precise and adaptive treatment by automatically adjusting stim-
    in the healthy condition, it conserves energy by deactivating             ulation parameters based on environmental feedback. Within
    stimulation, preventing side effects.                                    the interactive environment, we focused on the core dynamic
                                                                                 changes of action potentials of neuron cells in the BGT
    D. Continuous Episode Evaluation                                       network. This simulation allows to capture more       precise
  The outperformed TD3 architecture is further evaluated information between cell synapses. Additionally, unlike earlier
in continuous episodes to mimic real-world deployment. studies, the mechanism with intermittent pathological and
Conterminous states with RL model intervention and its healthy states aims to enhance the robustness of our RL model
corresponding beta band scalogram are shown in Fig. 10. across varying neuronal conditions.
    We extract the information of the PD occurrence index from                     We fine-tuned parameters in mainstreamed RL architec-
the environment to portray the “ground truth” of a healthy tures in evaluation for energy efficiency and error correction.
control or parkinsonism state for reference. Between 0 and Due to shared dynamics between PD and healthy states
200 ms, as a healthy state, the model maintains a stimulation in our environment, off-policy algorithms efficiently reuse

    CHO et al.: CLOSED-LOOP DBS WITH RL AND NEURAL SIMULATION    3623










Fig. 10. Continuous episode with RL agent intervention and its corresponding beta band scalogram. The dotted line separates each episode.
Frequency of 132 Hz and amplitude of 3087 μA/cm2 at 300∼400 ms; 104 Hz and 4473 μA/cm2 at 500∼600 ms; 116 Hz and 150 μA/cm2 at
700∼800 ms; 132 Hz and 3985 μA/cm2 at 1000∼1100 ms.

data and generalize across states. Experience replay allows assess the performance of the model through preclinical animal
for more stable policy updates and can be beneficial when experiments and refine our research with the aforementioned
dealing with diverse scenarios. In TD3, the implementation methods in the future.
of exploration strategies, such as noise injection in the action Following our in silico simulations, future research will
space, also proves to be effective in handling various initial focus on integrating the RL model into a cl-DBS system.
states. This involves embedding the model in low-latency systems,
  While the software-driven approach used in this research such as FPGAs or embedded processors, to enable real-time
provides significant convenience as a controlled testing envi- data processing and feedback loops, and validating the system
ronment, it may face challenges when applied to in vivo through preclinical animal studies. To fit the RL model within
models due to the complexity of biological systems and the constraints of battery-operated or embedded devices, tech-
the variability of individual responses. The discrepancy in niques such as model compression, pruning, and quantization
performance between the BGT network and real-world electro- will be employed. Effective integration will also require
physiological signals could stem from several factors such as incorporating real-time monitoring and safety mechanisms to
data distribution differences, noise and artifacts, sampling rate prevent overstimulation and ensure continuous adaptability.
mismatch, and feature variability. To alleviate such differences, Pre-deployment testing and simulation using neural simulators
the feature extraction methods have been preliminarily verified will help validate the model’s performance under in vivo
in real signals. Future research should address these limitations conditions. Additionally, cloud-based processing and strict
by considering additional brain nuclei in the pathological adherence to regulatory standards will ensure robust and safe
network to overcome the discrepancies between simulated operation. Longitudinal studies will be essential for adapting
and actual in vivo conditions as well as reveal other poten- the model to evolving patient conditions. These combined
tial numerical features that contribute to RL training, e.g., efforts will bridge the gap between simulation and real-world
gamma and theta band oscillations [38]. Utilizing a personal- application, paving the way for advanced DBS treatments.
ized and electrophysiological-based neural simulation model,
as suggested in [39], might also facilitate more effective cus- V. CONCLUSION
tomization of parameter adjustments to individual differences. This study presents a significant advancement in the appli-
For the RL agent model, domain adaptation techniques such cation of cl-DBS for Parkinson’s patients. By instantiating a
as transfer learning or adversarial training can bridge the gap basal ganglia-thalamic (BGT) model and designing it as an
between training and deployment domains. Further, fine-tuning interactive RL-friendly environment, we established four finely
the model on small datasets from individual patients also tuned RL agents (SAC, TD3, PPO, A2C) for comprehensive
enhances its adaptation to their specific characteristics. We will comparison.

    3624    IEEE TRANSACTIONS ON NEURAL SYSTEMS AND REHABILITATION ENGINEERING, VOL. 32, 2024



   The major findings highlight the remarkable efficacy of the [16] D. Terman, J. E. Rubin, A. C. Yew, and C. J. Wilson, “Activity patterns
                       optimized TD3 architecture, which demonstrated a substantial          in a model for the subthalamopallidal network of the basal ganglia,”
67% reduction in average power dissipation compared to [17] J. Neurosci., vol. 22, no. 7, pp. 2963–2976, Apr. 2002.
                         the open-loop system. Notably, this reduction was achieved          R. Q. So, A. R. Kent, and W. M. Grill, “Relative contributions of local
                                                                                             cell and passing fiber activation and silencing to changes in thalamic
                           while preserving the normal response of the BGT network,          fidelity during deep brain stimulation and lesioning: A computational
                     showcasing the potential for improved energy efficiency in cl-          modeling study,”      J. Comput. Neurosci., vol. 32, no. 3, pp. 499–519,
                      DBS. TD3 effectively mitigated thalamic error responses under   [18]   2012.
                                                                                             M. Rizzone, “Deep brain stimulation of the subthalamic nucleus in
                       pathological conditions and exhibited optimal performance to          Parkinson’s disease: Effects of variation in stimulation parameters,”
                           achieve complete power savings under healthy conditions.          J.   Neurol., Neurosurg. Psychiatry, vol.  71, no.    2,    pp. 215–219,
These results underscore the significance of our adaptive [19] Aug. 2001.
        R. Ramasubbu, S. Lang, and Z. H. T. Kiss, “Dosing of electrical
    parameter tuning for optimizing therapeutic effects.                                     parameters in deep brain stimulation (DBS) for intractable depression:
                              The integration of RL algorithms into DBS controllers          A review of clinical studies,”     Frontiers Psychiatry, vol. 9, p. 302,
represents a promising avenue for advancing neuromodula- [20] Jul. 2018.
        A. D. Dorval, A. M. Kuncel, M. J. Birdno, D. A. Turner, and
                      tion therapies. These controllers offer dynamic and adaptable          W. M. Grill, “Deep brain stimulation alleviates parkinsonian bradyki-
                    parameter tuning, enhancing the precision and efficacy of stim-          nesia by regularizing pallidal activity,” J. Neurophysiol., vol. 104, no. 2,
ulation. The envisioned future development and deployment [21] pp. 911–921, Aug. 2010.
        P. Gorzelic, S. J. Schiff, and A. Sinha, “Model-based rational feedback
                        of such controllers hold the potential to revolutionize DBS          controller design for closed-loop deep brain stimulation of Parkinson’s
treatments, offering personalized and optimized interventions [22] disease,” J. Neural Eng., vol. 10, no. 2, Apr. 2013, Art. no. 026016.
    tailored to individual patient needs.                                                    Gymnasium Documentation. Accessed: Jul. 2024. [Online]. Available:
                                                                                             https://gymnasium.farama.org/
                                                                                      [23]   M. S. Okun, “Deep-brain for parkinson’s disease,” New England J. Med.,
                                         REFERENCES                                   [24]   vol. 367, no. 16, pp. 1529–1538, Oct. 2012.
                                                                                             T. M. Herrington, J. J. Cheng, and E. N. Eskandar, “Mechanisms of
     [1]  T. Lebouvier et al., “The second brain and Parkinson’s disease,”     Eur.          deep brain stimulation,”   J. Neurophysiol., vol. 115, no. 1, pp. 19–38,
          J. Neurosci., vol. 30, no. 5, pp. 735–741, Sep. 2009.                              2016.
 [2] Parkinson’s Disease Foundation. Accessed: Jan. 2024. [Online]. Avail- [25] B. Hjorth, “EEG analysis based on time domain properties,” Electroen-
          able: https://www.parkinson.org/Understanding-Parkinsons/Statistics                cephalogr. Clin. Neurophysiol., vol. 29, no. 3, pp. 306–310, Sep. 1970.
 [3] W. Dauer and S. Przedborski, “Parkinson’s disease: Mechanisms and [26] S.-B. Lee et al., “Predicting Parkinson’s disease using gradient boosting
          models,” Neuron, vol. 39, no. 6, pp. 889–909, Sep. 2003.                           decision tree models with electroencephalography signals,” Parkinson-
     [4]  J.   Jankovic,  “Parkinson’s   disease: Clinical features and diagnosis,”          ism Rel. Disorders, vol. 95, pp. 77–85, Feb. 2022.
     J. Neurol. Neurosurg. Psychiatry, vol. 79, no. 4, pp. 368–376, [27] S. Little and P. Brown, “What brain signals are suitable for feedback
          2008.                                                                              control of deep brain stimulation in Parkinson’s disease?” Ann. New York
     [5]         W. Xu, G. S. Russo, T. Hashimoto, J. Zhang, and J. L. Vitek, “Sub-          Acad. Sci., vol. 1265, no. 1, pp. 9–24, Aug. 2012.
     thalamic nucleus stimulation modulates thalamic neuronal activity,” [28] J. S. Richman and J. R. Moorman, “Physiological time-series analysis
          J. Neurosci., vol. 28, no. 46, pp. 11916–11924, Nov. 2008.                         using approximate entropy and sample entropy,” Amer. J. Physiol.-Heart
     [6]      M. Parastarfeizabadi and A. Z. Kouzani, “Advances in closed-loop deep          Circulatory Physiol., vol. 278, no. 6, pp. H2039–H2049, Jun. 2000.
     brain stimulation devices,” J. NeuroEngineering Rehabil., vol. 14, no. 1, [29] J. E. Fleming and M. M. Lowery, “Changes in neuronal entropy
          pp. 1–20, Aug. 2017.                                                               in a network model of the cortico-basal ganglia during deep brain
     [7]  F. Alonso-Frech et al., “Non-motor adverse effects avoided by directional          stimulation,” in Proc. 41st Annu. Int. Conf. IEEE Eng. Med. Biol. Soc.
          stimulation in Parkinson’s disease: A case report,”    Frontiers Neurol.,          (EMBC), Jul. 2019, pp. 5172–5175.
          vol. 12, Jan. 2022, Art. no. 1756286419838096.                              [30]   M. F. Anjum, S. Dasgupta, R. Mudumbai, A. Singh, J. F. Cavanagh, and
     [8]  V.   Gómez-Orozco,    I.  De   La Pava  Panche, A.  M.      Álvarez-Meza,          N. S. Narayanan, “Linear predictive coding distinguishes spectral EEG
               M. A. Álvarez-López, and Á. Á. Orozco-Gutiérrez, “A machine learning          features of Parkinson’s disease,”  Parkinsonism Rel. Disorders, vol. 79,
          approach    to support    deep brain stimulation programming,”    Revista          pp. 79–85, Oct. 2020.
     Facultad Ingeniería Universidad Antioquia, vol. 89, no. 95, pp. 20–33, [31] T. Haarnoja et al., “Soft actor-critic: Off-policy maximum entropy
          Dec. 2019.                                                                         deep reinforcement learning with a stochastic actor,” in     Proc. ICML,
     [9]          M. Lu, X. Wei, Y. Che, J. Wang, and K. A. Loparo, “Application of          Stockholm, Sweden, 2018, pp. 1861–1870.
     reinforcement learning to deep brain stimulation in a computational [32] S. Fujimoto et al., “Addressing function approximation error in
             model of Parkinson’s disease,” IEEE Trans. Neural Syst. Rehabil. Eng.,          actor-critic methods,” in    Proc. ICML,   Stockholm, Sweden,      2018,
          vol. 28, no. 1, pp. 339–349, Jan. 2020.                                            pp. 1587–1596.
[10] D. Krylov, R. Tachet des Combes, R. Laroche, M. Rosenblum, and [33] J. Schulman, F. Wolski, P. Dhariwal, A. Radford, and O. Klimov,
                D. V. Dylov, “Reinforcement learning framework for deep brain stim-          “Proximal policy optimization algorithms,” 2017, arXiv:1707.06347.
     ulation study,” in Proc. 29th Int. Joint Conf. Artif. Intell., Yokohama, [34] V. Mnih, “Asynchronous methods for deep reinforcement learning,” in
          Japan, Jul. 2020, pp. 2847–2854.                                                   Proc. ICML, New York, NY, USA, 2016, pp. 1928–1937.
[11] Q. Gao et al., “Model-based design of closed loop deep brain stimulation [35] A. Paszke et al., “PyTorch: An imperative style, high-performance deep
          controller using reinforcement learning,” in     Proc. ACM/IEEE 11th Int.          learning library,” 2019, arXiv:1912.01703.
          Conf. Cyber-Phys. Syst. (ICCPS), Apr. 2020, pp. 108–118.                    [36]   T. P. Lillicrap et al., “Continuous control with deep reinforcement
    [12]         H. Agarwal and H. Rathore, “Novel reinforcement learning algorithm          learning,” in Proc. ICLR, San Juan, Puerto Rico, May 2016.
     for suppressing synchronization in closed loop deep brain stimulators,” [37] J. Schulman et al., “Trust region policy optimization,” in Proc. ICML,
          in          Proc. 11th Int. IEEE/EMBS Conf. Neural Eng. (NER), Apr. 2023,          Lille, France, 2015, pp. 1889–1897.
          pp. 1–5.                                                                    [38]   E. M. Adam, E. N. Brown, N. Kopell, and M. M. McCarthy, “Deep
    [13]  G. Brockman et al., “OpenAI gym,” 2016, arXiv:1606.01540.                          brain stimulation in the subthalamic nucleus for Parkinson’s disease
    [14]  R. S. Sutton et al.,           Reinforcement Learning: An Introduction, 2nd ed.,   can restore dynamics of striatal networks,” Proc. Nat. Acad. Sci. USA,
          Cambridge, MA, USA: MIT Press, 2018.                                               vol. 119, no. 19, May 2022, Art. no. e2120808119.
[15] J. E. Rubin and D. Terman, “High frequency stimulation of the [39] C. M. Davidson, A. M. de Paor, H. Cagnan, and M. M. Lowery,
              subthalamic nucleus eliminates pathological thalamic rhythmicity in a          “Analysis of oscillatory neural activity in series network models of
           computational model,” J. Comput. Neurosci., vol. 16, no. 3, pp. 211–235,          Parkinson’s disease during deep brain stimulation,” IEEE Trans. Biomed.
          May 2004.                                                                          Eng., vol. 63, no. 1, pp. 86–96, Jan. 2016.
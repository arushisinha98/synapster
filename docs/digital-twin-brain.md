RESEARCH ARTICLE
Digital Twin Brain: Generating Multitask
Behavior from Connectomes for  Citation: Takahashi Y, Soda T,
Personalized Therapy Tomita H, Yamashita Y. Digital Twin
        Brain: Generating Multitask Behavior
        2
Yuta  Takahashi1,2*, Takafumi  Soda¹, Hiroaki  Tomita ,  from Connectomes for Personalized
and Yuichi  Yamashita1* Therapy. BME Front. 2026;7:Article
        0231. https://doi.org/10.34133/
        bmef.0231
1Department of Information Medicine, National Center of Neurology and Psychiatry, Tokyo, Japan. 2Department
of Psychiatry, Graduate School of Medicine, Tohoku University, Sendai, Japan. Submitted 26 September 2025
        Revised 13 January 2026
        Accepted 14 January 2026
*Address correspondence to: ytakaha@ncnp.go.jp (Y.T.); yamay@ncnp.go.jp (Y.Y.) Published 12 February 2026

Objective: This study introduces and validates a digital twin brain framework designed to translate an Copyright © 2026 Yuta Takahashi
individual’s brain connectome into predictions of multitask neurobehavioral dynamics and personalized et al. Exclusive licensee Suzhou
functional modulations. Impact Statement: We introduce a novel 2-component architecture—where Institute of Biomedical Engineering
        and Technology, CAS. No claim to
a hypernetwork personalizes a main network from an individual’s connectome—establishing a mechanistic original U.S. Government Works.
platform to simulate and design personalized interventions by directly linking connectomes to behavior. Distributed under a Creative
Introduction: Personalized psychiatry requires digital twin models that can predict functions across multiple Commons Attribution License
domains, such as affective and cognitive processing, from an individual’s unique neurobiology. However, (CC BY 4.0).
existing models struggle to bridge the gap between brain structure and complex, multitask behavior,
limiting their clinical utility. Methods: A hypernetwork uses an individual’s resting-state connectome to
generate parameters for a main recurrent neural network that simulates participant-specific behavioral
and blood-oxygen-level-dependent (BOLD) time series across tasks. Leveraging the model’s end-to-end
architecture linking connectomes to behavior, we used gradient backpropagation to identify connectome
manipulations designed to selectively modulate affective or cognitive functions. Results: Validated on 228
individuals, the model predicted behavioral choices with over 90% accuracy, reaction times (r > 0.85),
and BOLD patterns (r = 0.84) with high fidelity. Crucially, in silico interventions successfully modulated
targeted functions and reproduced realistic, interindividual variability in treatment effects arising from
each person’s baseline connectome. Conclusion: This digital twin brain system enables high-fidelity,
in silico prediction and personalized modulation of complex neurobehavioral functions, advancing the
potential for individualized psychiatric care.



Introduction   The first challenge is the gap between neurobiological sub-
The   realization of personalized medicine is an important strates and higher-order cognition and behavior that define
goal in modern medicine. Toward achieving this, the devel- psychiatric symptoms [  8 ,  9 ]. Research aimed at bridging this
opment of “digital twins”—mathematical models that mimic gap has 2 main streams [ 9 ]. In the bottom-up tradition, bio-
an individual’s organ functions to simulate and predict treat- physically grounded simulations are personalized using an
ment responses [ 1  ]—is gaining substantial attention. In the individual’s connectome or microstructural data (e.g., neural
context of brain modeling, approaches to constructing these mass and neural field models) [  10 ,  11 ]. These models can repro-
digital replicas can be broadly categorized by their level of duce resting-state functional connectivity and even epileptic
biological detail. While some digital twin approaches empha- seizure dynamics, yet they face difficulties in modeling complex
size biophysical structure (e.g., neural mass models con- higher-order cognitive functions [ 2 , 9 ]. Conversely, the top-
strained by white matter tracts) [  2 ,  3 ], others aim to capture down tradition begins with abstract algorithms such as Bayesian
functional  input–output  relationships  [ 1 ,  4 ].  inference, reinforcement learning, or active-inference agents
        This  technology
holds potential as a powerful tool for advancing personalized [ 8 ,  12 –  14 ].  Although  these  frameworks  capture  between-patient
medicine, particularly for psychiatric disorders, where the variability in cognition and behavior, they are usually fitted to
underlying mechanisms and symptom manifestations vary behavioral data and only post hoc related to neural signals via
significantly among patients [  5 ]. However, constructing a correlation; the structural wiring and physiology of the indi-
functional “digital twin brain” capable of capturing the com- vidual play no causal role in their generative machinery [ 8 ].
plexity of psychiatric disorders faces several major challenges Thus, neither existing approach has successfully linked neuro-
[ 4 ,  6 ,  7 ]. biological substrates with higher-order cognition in a dynamic
        manner. Therefore, the development of models bridging this

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231 1

    divide is an urgent priority for a truly personalized, mechanistic     connectome is directly linked to real-time brain activity and
    digital twin brain.                                                    behavior generation, gradient calculations can be used to
     The      second challenge is the difficulty of unifying multiple      explore effective intervention targets (e.g., identifying specific
    functional domains affected by psychiatric disorders within a          parts of the connectome for intervention) aimed at shifting
    single model. Most psychiatric disorders involve impairments           specific behaviors or brain activities in the desired direction.
    across several domains, not just one [ 8 ]. For instance, the          Moreover, by manipulating the main network, which reflects
    National Institute of Mental Health’s Research Domain Criteria         an individual’s connectome, we can simulate the intervention
    (RDoC) framework highlights the need to understand dysfunc-            effects on behavior and brain activity, thereby realizing predic-
tion across different functional domains [ 15  ]. For instance, in tions of personalized behavioral perturbations. In this study,
depression, individuals often exhibit deficits in both the Negative we empirically demonstrate that our proposed system, through
    Valence Systems domain (e.g., altered affective responses) and         the aforementioned approaches, overcomes existing challenges
    the Cognitive Systems domain (e.g., reduced processing speed)          and can potentially make a significant contribution to deepen-
    [  16 ,  17 ]. However, most current brain modeling research focuses   ing our understanding of psychiatric disorder mechanisms and
    on single domains or tasks, failing to capture such complex,           advancing the development of personalized therapies.
    multidomain impairment profiles seen in individuals [ 8 ].
    Hence, an individualized digital twin brain is expected to model       Results
    dysfunctions across multiple relevant domains, including their
    interactions, within a single framework, thereby contributing          System overview
    to a deeper understanding of the pathophysiology and optimal           The proposed digital twin brain system (Fig.                 1     A) comprises 2
    treatment     selection.                                               main components: a hypernetwork implemented as a multi-
       The third challenge is the gap toward realizing personalized        layer perceptron (MLP) and a main network implemented as
    treatment simulations. Significant individual differences in the       a recurrent neural network (RNN). The hypernetwork receives
    effectiveness of psychiatric therapies, such as pharmacotherapy        resting-state functional connectivity matrix (rsFCM) data, an
    and brain stimulation, have been observed even within the              indicator of an individual’s brain connectome, and transforms
    same diagnostic group [  18 ]. Predicting the treatment effect for     them into a personalized parameter set W
    individual patients would lead to an optimized treatment selec-            (                                                     main   ).  These  param-
    tion. Despite this known individual variability, many existing         eters configure every weight and bias in the subsequent main
    treatment simulation studies using brain models use approaches         network. The main network receives a joint input comprising
                                                                           the current visual sensory input [
    based on the average characteristics of a disorder rather than             sensor(t)   ] and                                            a task condition
                                                                                                                                         (t + 1)     and
    individual characteristics, thus failing to sufficiently account       indicator, and it predicts the next-step action action            (t + 1)   ],
    for these differences. Although nascent research aimed at pre-         blood-oxygen-level-dependent (BOLD) signal [ BOLD
    dicting individual treatment effects has begun, such approaches        representing neural activity. In this manner, the 2 networks
    often remain limited [ 19   ]. They might predict the impact of        integratively model an individual’s functional connectivity,
    specific interventions on brain activity but typically lack a          together with the coupled sensory, behavioral, and neural
    dynamic simulation of how neural changes directly generate             dynamics  that  unfold  over  time.
    subsequent alterations in an individual’s higher-order cognition           The rsFCM, along with sensory, action, and BOLD signal
    and  resulting  behavior  [  20 –  22 ].                               data obtained during the tasks used to build the proposed sys-
     In   this study, we propose a functional digital twin brain           tem, was obtained from 228 participants (139 with psychi-
    system designed to overcome these challenges. Unlike biophysi-         atric disorders and 89 controls) from the Transdiagnostic
    cal models constrained by anatomical structure, our approach           Connectome Project (TCP) dataset. Considering the coverage
    leverages generative modeling to learn the mapping from func-          of multiple functional domains defined by the RDoC, we used
    tional connectomes to high-dimensional behavioral dynamics.            the Emotional Faces task to assess the Negative Valence Systems
    Our system uses an architecture consisting of 2 components: a          domain and the Stroop task to assess the Cognitive Systems
    “hypernetwork” and a “main network” [  23 ,  24 ]. The hypernet-       domain. The sensory, action, and BOLD signal data from these
    work uses an individual’s neurobiological connectome data as           tasks were prepared to have a common time resolution of 80
    input and dynamically generates the parameters for the main            ms, which involved interpolating the BOLD signal. The BOLD
    network. On the basis of these generated parameters, the main          signal data comprised signals from 20 brain regions distributed
    network simulates higher-order cognitive processes from sen-           throughout the brain. The multimodal task sequences (sensor,
    sory input to action generation. This directly integrates indi-        action, and BOLD signals) were divided into 2 parts: the first
    vidual biological data with cognitive and behavioral dynamics,         half served as the training dataset and the second half as the
    thereby bridging the first challenge: the gap between biological       test dataset.
    data and psychiatric symptoms. Furthermore, by incorporating                 For the experimental procedure, in the training phase (Fig.
    conditioning techniques into the main network, we essentially
                                                                           1
                                                                                                  B), the hypernetwork was optimized using the training data-
    provided the current task context alongside sensory input to           set. At each training iteration, the main network, initialized
    guide processing, enabling a single model architecture per indi-       with hypernetwork-generated parameters ( W main   ) ,  produced
    vidual to reproduce behavioral and brain activity patterns             predictions for the forthcoming action and regional BOLD
    across multiple tasks representing different functional domains.       signals. A composite loss  L,    which is the weighted sum of the
    This facilitates the construction of a digital twin brain model        prediction errors for the action and BOLD signal targets, was
    that reflects individual characteristics across multiple domains,      then backpropagated through time. Gradients reached the
    thereby addressing the second challenge. Consequently, this            hypernetwork, compelling it to map the individual’s rsFCM
    integrated model paves the way for personalized treatment              to a set of the main-network parameters ( W main   )  that  mini-
    simulations, thus tackling the third challenge. Because the            mized  L.    The convergence of the training was confirmed by

    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                              2

A  Proposed system
  Brain         rsFCM     Hypernetwork (MLP)
                THN
            connectome                    TRAN ©
                                          SLED
  °      eddᴴ
                                              Winain
Individual  |                                 RNN     _w action (t +1
            Sensory-behavioral -neural    Condition        Bold (t +1

            dynamics
                                              Main network

B Training phase    rsFCM                Hypernetwork optimization     aL
                                         ANION,     © Whyper = a     hyper

  °             i                             Backward propagation

Training        H                             ay action (t + 1 gp action (t +1
datasets                                 Sensor (t)    RNN     ASE     Prediction error
                                              (t +1
                Condition                     (t+1)     Bold


C Evaluation phase
            rsFCM



 Test       —                         NEY     Winain                                                       R
 datasets   H                          Sensor (t)      RNN | 4 action (t +1                                                Evaluate prediction
                                   Condition                                                       SA   Bold (t+1)         accuracy

D  Treatment simulation

                       @ Estimate effective
                rsFCM  intervention

 °          i    >         o                  o                                                    © Calculate effective
                                                                                                         change

 Test
 datasets   i                      Sensor (t)      RNN                                             rad actionᵃ (t + 1),   @ Predict
                                   Condition                                                       “NA  Bold (t+1)        treatment effects

Fig. 1. Proposed system and experimental procedure. (A) shows the proposed digital twin brain system, whereas (B) to (D) illustrate the experimental procedure [(B) training
phase, (C) evaluation phase, and (D) treatment simulation]. Wmain and Whyper represent the learnable parameters of the main network and hypernetwork, respectively. L is the
loss function,  is the learning rate, and Opt is the optimization operator applied to the gradient.

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                     3

    the monotonic decline in the training loss (Fig. S1     ). In the             A     Emotional Faces task                  B    Stroop task
    subsequent evaluation phase (Fig.  1 C), a test dataset is used to
    verify the generalization performance of the proposed system.                 1,400                                |  1,400
        involved evaluating      the system, using rsFCM and
    This        whether
    sensor input from the test dataset, could generate action and                 1,200        Vo                         1,200
    BOLD signals exhibiting the characteristics of an individual            ~~                                            1,000
    with high accuracy.                                                           1,000                                     800                 3
          Finally, in the treatment simulation (Fig.  1 D), we set 2 goals:         800             =                                       N
    (a) to identify manipulations of rsFCM that yield intervention                                                     |    600
    effects for each of the multiple functional domains and (b) to          ~~      600    °°                                                          #10.80,088]
    predict the behavioral and neural outcomes of applying                            600     800 1,000 1,200
                                                                  those                                                     400    500 750  1,000 1,250         1,500
    manipulations on an individual basis. Intervention efficacy was                          Observed reaction time (ms)               Observed reaction time (ms)
    quantified by changes in the main network’s predicted action                  Fig. 2. Reproduction of individual differences in reaction times. (A) Reproduction
    sequence and regional BOLD dynamics relative to the prein-                    of reaction times in the Emotional Faces task. This scatter plot shows observed
tervention baseline. The detailed framework of the simulation reaction times from test data for each individual on the x axis (specifically, the the
    is described later. Briefly, focusing on the fact that the indi-              time from stimulus presentation to button press). The y axis shows reaction times
    vidual dynamics of these actions and BOLD signals are repre-                  calculated using the same methodology from action sequences predicted by the main
sented in the main network’s weight parameters ( W main   ), network. The high correlation coefficient (r = 0.90) indicates that the main network
we first calculated the optimal change in weight parameters successfully predicts action sequences while reflecting individual differences in in
    ( ΔW main)    required to achieve the best intervention effect.               reaction times. The 95% confidence interval for the correlation coefficient is provided
    Subsequently, through gradient calculation within the hyper -                 in parentheses. (B) Reproduction of reaction times in the Stroop task. Similarly, this
    network, we identified the specific manipulations on rsFCM                    scatter plot shows observed reaction times on the x axis and reaction times calculated
    designed to achieve the target change in weight parameters                    from sequences predicted by the main network on the y axis. The high correlation
    ( ΔW main   ). Finally, we performed virtual intervention by mod-             coefficient (r = 0.85) demonstrates that the main network can reproduce actions that
    ifying the weight parameters of the main network, subse-                      reflect individual differences in reaction times in the Stroop task as well. Combined
                                                                                  with the previously mentioned results from the Emotional Faces task, these findings
    quently generating new actions and BOLD signals with the                      indicate that the unified main network successfully reproduces individual behavioral
    altered network, and investigated the individual-specific inter-              characteristics across multiple tasks.
    vention  effects.
    Accuracy of action prediction                                                 model (GLM), a standard approach in functional magnetic
    We now describe the evaluation of the generalization perfor        -          resonance imaging (fMRI) analysis. This analysis revealed a
    mance of the action predictions conducted in the evaluation                   strong correlation ( r = 0.84) between the observed and pre-
    phase. The concordance rate between the action sequences                      dicted BOLD signals in the task-specific region-wise -statistics t
    predicted by the model and the participants’ actual choices was               (Fig. 3  B). These results indicate that the main network accu-
    high, with a means ± SD of 0.94 ± 0.06 for the Emotional Faces                rately captured the BOLD signal characteristics specific to dif-
    task (2-choice) and 0.90 ± 0.10 for the Stroop task (3-choice).               ferent tasks and brain regions. Crucially, we confirmed that
    Furthermore, when the reaction times from sensory input to                    this high prediction accuracy was robust to the preprocessing
    action output were calculated using the predicted sequences, a                strategy; results remained consistent when using linear inter -
    strong correlation with the observed reaction times was found                 polation or when evaluating predictions solely at the original
    (r = 0.90 for the Emotional Faces task and r         = 0.85 for the           acquisition time points (Fig. S6     ). Notably, both the observed
    Stroop task; Fig. 2  ). This demonstrates that the connectome-                and predicted data showed high t-statistic values in the primary
    informed main network accurately predicts actions based on                    visual cortex, higher visual cortex, and amygdala during the
    sensory input and captures individual behavioral differences,                 Emotional Faces task, consistent with prior fMRI studies
                                                                                  [
                                                                                  25
    indicating its ability to reproduce individual-specific, higher-                 –  28 ], and confirming the validity of our model’s predictions.
    order  cognitive  functions.                                                  This high correspondence in t -statistics, despite imperfect
                                                                                  moment-to-moment matching, arises because observed fMRI
                                                                                  signals contain both task-evoked neural components and sub-
    Accuracy of BOLD signal prediction                                            stantial stochastic noise (e.g., physiological and scanner noise).
    Having      established the model’s ability to predict behavioral             Since our main network is a deterministic model designed to
    actions, we next examined its capacity to capture the underlying              learn systematic input–output relationships, it predicts the
    neural dynamics by predicting unseen BOLD signal character-                   “denoised” task-evoked component but does not reproduce
    istics concurrently with actions. A visual comparison of the                  the stochastic noise. Therefore, the high correlation in GLM-
    predicted and observed BOLD signals (Fig.  3 A) revealed simi-                derived statistics demonstrates that the model successfully
    larities and differences. Although time-point level matching is               captures the underlying neural signal once noise is analytically
    imperfect because of the inherently noisy nature of BOLD data,                removed. Furthermore, as shown in Fig. 3  C, we found strong
    the predicted signals successfully captured response patterns                 correlations between the observed and predicted mean values
    to the presented task stimuli, such as signals that increased                 of the BOLD signals across individuals, demonstrating high
    during face presentation and decreased during shape presenta-                 accuracy in capturing interindividual differences. Overall,
    tion. To move beyond visual assessment and quantitatively                     despite not perfectly matching moment-to-moment fluctua-
    evaluate performance in predicting these stimulus-specific                    tions in the BOLD signal, our model effectively captured both
    response patterns, we computed t -statistics (indicating the                  individual-specific neural response patterns and task-related
    strength of task-related BOLD responses) using a general linear               activation  across  brain  regions  in  an  unseen  test  dataset.


    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                              4










 Predicted reaction time (ms)










Predicted reaction time (ms)

          A             ~ — ~ Observation                               Emotional Faces presentation                         interval
                        — Prediction                                    (O shapes presentation interval
                     1             1            1            0806₁               1                 1        1       0:₁            1  1
           1.0               nA¹                1        Ah  1                   1                 1        1  1       nwll        1  1
                                                [NEI                                                                               [I
           0.9               fw                                                 In                          1             |        1  wy
                        I                       1                   \                                               1              1  1
                                   [Bh          1                   |                                               1              1  1
           0.8                     1                         1                                                      1
                                   TEL                                  \                          [I\              |         1
                                                             1          wi                                          1         Auwvl   11
           0.7                                  1            1              “1                                      1              1  1
               Moving0       average 25            50                   75                             125          150               175 200
                                        window 3.2 s)                                 Time (s)

          B                                                                                                      C
                                   )
                30   r=      0.84                            # | Face                 Stroop                   5

          =                        i                                        LR         LR                        4
    gL                                         Ady                              ®®     00 PFC                  3.
          3                        i
          £                                                                     VY     VVVLPFC                 &
        fo)                        i                                                                             0
          5                        |                     *                      AA     AA Premotor             Q
          9     10           3                      x                           44     44m                     9 -2               /
          5                                                                     >>                St           Ny
          8                                                             HE                        Parietal     2,            Ld       r> 0.99
                             » ®           v                                    ®®                Auditory              LJ   -5.0 -25 0.0 25                          5.0
                                   |                                                              HVC               Mean BOLD (observation)
               ®                   ;                                                   Nx v1
                        -10        0       10      20       30                                    Amygdala

                             t-statistics  (observation)
Fig. 3. Comparison of observed and predicted BOLD signals. (A) Example of observed and predicted BOLD signals. The plot shows observed and predicted BOLD signals in the
left primary visual cortex during the Emotional Faces task, representing a typical example of BOLD signal responses to task stimuli. The predicted BOLD signals are displayed
as moving averages over a time window of 3.2 s (40 time steps) to reduce fluctuations. (B) Scatter plot showing results from group-level GLM analysis conducted for each
task and brain region to quantitatively evaluate the magnitude of BOLD signal responses to task stimuli. See Materials and Methods for GLM analysis details. The x axis shows
t-statistics (representing neural response strength) calculated from GLM models based on observed BOLD signals, while the y axis shows t-statistics from GLM models based
on BOLD signals predicted by the main network. aPFC, anterior prefrontal cortex; VLPFC, ventrolateral prefrontal cortex; HVC, higher visual cortex. (C) Scatter plot displaying
the mean values of observed BOLD signals (x axis) versus BOLD signals predicted by the main network (y axis), calculated for each individual, brain region, and task.

Defining functional indicators and validating                                           functional domains. The first indicator, the affective response,
intervention directions                                                                 was defined as the strength of the amygdala response, repre-
Having         established the model’s fidelity in capturing indi-                      sented by the t-statistic calculated from a GLM model of BOLD
vidual sensory–behavioral–neural dynamics, we next sought                               signals during the Emotional Faces task. The second indicator,
to leverage this generative capability to simulate personalized                         representing the Cognitive Systems domain, was processing
interventions. Specifically, we aimed to identify connectome                            speed, which is defined as the reaction time calculated from
manipulations that could modulate targeted cognitive and                                action sequences during Emotional Faces and Stroop tasks.
affective functions, thereby validating the feasibility of our digi-                    Next,                        we investigated manipulations to efficiently affect
tal twin framework.                                                                     functional indicators (affective response and processing speed).
           In            the intervention simulation, we defined 2 functional           Individual differences in these indicators reflect variations in
indicators aimed at functional changes based on the RDoC                                the main network outputs, which, in turn, are governed by its

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                5

    weight parameters ( W main   ), efficiently affecting the functional         the affective latent variable (derived using corresponding
    indicators required to identify the optimal way to manipulate                vectors) showed nominally significant associations with
W main   . Accordingly, we identified a unit vector  v    representing emotion-related clinical indices, such as panic attack fre-
the “direction of change” in W main    that most effectively affects quency (panic disorder severity scale [PDSS]: r = −0.24,
these functional indicators. This vector v    ,  which  is  interpretable uncorrected  P = 1.1 × 10−3   ) and reward dependence (tem-
    as a coefficient vector indicating the relative contribution of              perament and character inventory [TCI]: r = −0.20, uncor-
    each weight parameter within  W main, specifies the pattern of               rected P     = 4.5 × 10−3   ). While these associations did not survive
    the combined change across these parameters, yielding the larg-              FDR correction ( P
    est impact on each functional indicator. To compute this vector              particularly       FDR > 0.05), the pattern of correlation—
v    , we used partial least-squares (PLS) regression analysis to suggests with traits associated with amygdala function—
    analyze the relationship between each functional indicator                   suggest biologically plausible links. Collectively, these results
    (dependent variable) and  W main    (independent  variable)  to                      that our approach captures the clinically relevant
    determine the direction of change most strongly correlated                   aspects of psychiatric disorders by encoding meaningful rela-
    with the changes in functional indicators. The vector that                   tionships between brain connectomes and functional indi-
    most effectively changed the affective response was defined                  cators. This implies that interventions that modify weight
    as v affective    (affective vector), and the vector that most effectively   parameters in the direction of the identified vectors may have
    changed the processing speed was defined as v cognitive    (cognitive        therapeutic potential by acting on the brain connectome under-
    vector). Thus, these vectors identify the optimal intervention               pinning clinical symptoms.
    directions.
                    After mathematically identifying the optimal manipulation    Derivation of connectome-based
    vectors, we examined whether these computationally derived                   intervention targets
    vectors were clinically significant. A key question was whether     On the basis of the identified optimal manipulation vectors
    the extent to which an individual’s weight parameters ( W main   )           ( vaffective    and vcognitive         ), we derived specific rsFCM connections
    matched the directionality of these computationally derived                  to manipulate and influence the functional indicators (affective
    vectors ( vaffective    and
    presentation. To  vcognitive      ) is related to their actual clinical      response and processing speed). This process of deriving
                              investigate this, we examined correlations with    rsFCM manipulation targets can be seen as computationally
    107 clinical measures (Table S1   ) and applied the Benjamini–               exploring optimal targets for clinical approaches, such as
    Hochberg false discovery rate (FDR) correction to account for                decoded neurofeedback or neurofeedback, which aim to alter
    multiple comparisons. Notably, the cognitive latent variable                 specific brain activity patterns [  29 ,  30 ]. To identify the interven-
    (derived using corresponding vectors) showed robust statistical              tion targets, we utilized gradient backpropagation through the
    significance with domain-specific clinical symptom scores even               hypernetwork. This allowed us to calculate the adjustments in
    after correction (Table 1  ). Specifically, it was positively corre-         rsFCM required to induce changes in the weight parameters of
lated with cognitive processing speed (digital symbol matching the main network ( W main   ) along the affective or cognitive vec-
[DSM]: r = 0.42, uncorrected  P = 3.3 × 10−11    P, FDR = 3.3 × 10−9   ) tors. The results revealed that rsFCM manipulation patterns
    and negatively associated with general functional impair -                   differed depending on the target functional indicators of the
    ment (longitudinal interval follow-up evaluation—range of                    intervention. Strengthening connectivity in bilateral motor
    impaired functioning tool [LIFE-RIFT]: r = −0.27, uncorrected                cortices (Fig.  4 A) and weakening connectivity between limbic
P = 1.8 × 10−4    P, FDR = 0.010   ).  Associations  with  psychiatric and parietal regions and between temporal and subcortical
symptoms, including positive symptoms and suicidal ideation, regions (Fig.  4 B) affected the affective response. To impact pro-
showed trends toward significance ( P
        FDR < 0.15). In contrast, cessing speed, we suggested the strengthening connectivity


    Table 1. Top clinical symptoms by absolute correlation with each latent variable

    Latent variable              Clinical symptoms            Test name  Correlation coefficient  P value  Adjusted P value (FDR)
     Affective latent variable    Panic attack frequency       PDSS                −0.24         1.1 × 10−3         0.118
                                  Reward  dependence           TCI                 −0.20         4.5 × 10−3         0.241
                                  Consummatory  pleasure       TEPS                −0.18         1.2 × 10−2         0.348
                                  Financial risk perception    DOSPERT             −0.18         1.3 × 10−2         0.348
     Cognitive latent variable    Processing  speed            DSM                 0.42         3.3 × 10−11      3.3 × 10−9
                                  Functional  impairment       LIFE-RIFT           −0.27         1.8 × 10−4         0.010
                                  Positive  symptoms           PANSS               −0.21         2.6 × 10−3         0.075
                                  Functional  impairment       MCAS                0.21          2.8 × 10−3         0.075
                                  Suicidal  behavior           C-SSRS              −0.20         6.9 × 10−3   0.148

    This table presents the clinical symptoms from the TCP dataset that exhibited the strongest correlations with affective and cognitive latent variables. TEPS,
    temporal experience of pleasure scale; DOSPERT, domain-specific risk-taking scale; PANSS, positive and negative syndrome scale; MCAS, multidimensional
    comorbidity assessment scale; C-SSRS, Columbia-suicide severity rating scale.



    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                   6

                                                                          Connections to be        Connections to be                    primarily arising from individual differences in baseline brain
                                                                     A Rstrengthened       L  B Rweakened         L       Prefrontal    connectomes, mirrors clinical response variability and suggests
                                                                                                                                        that our digital twin brain approach could help predict indi-
                                                                              72\                           WW            Motor         vidual  treatment  efficacy  before  intervention.
                                                                                                   QA                     Insula
                                                                          iS Ak
                                                                              =                                           Temporal
                                                                                                        Re=|              Parietal      Discussion
                                                                          NOW                                Vv           Occipital       In this study, we demonstrated that a novel digital twin brain
                                                                                                            WS           I Limbic       framework can successfully predict individual behavioral
                                                                     C                     L  D                          0 Cerebellum   responses and simulate personalized treatment effects in psy-
                                                                         R        R                              L        Subcortical   chiatric disorders. Our framework integrates individual biologi-
                                                                                                        <\   7                          cal brain connectomes (rsFCM) with sensory–behavioral–neural
                                                                                                                                        dynamics during task performance, thereby creating a high-
                                                                                                                                        fidelity model of personalized higher-order brain functions.

                                                                              =
                                                                              IS                   =                                    This model synergistically combines a hypernetwork that cap-
                                                                              Vv                             4                          tures static brain connectomes with a main network that
                                                                              TIN                       SemA=                           sequentially generates actions and BOLD signals from sensory
                                                                                                                                        inputs. This integration enables our framework to transcend
   Fig. 4. Optimal brain connectivity manipulations for intervention. (A and B) Brain                                                   the limitations of previous personalized brain models, which
   connections that should be strengthened (A) or weakened (B) to affect affective                                                      primarily focus on replicating resting-state or simple sensory
   responses. (C and D) Brain connections that should be strengthened (C) or weakened                                                   processing, by simulating dynamic brain activity and behavior
   (D) to affect processing speed. To determine the optimal manipulations in resting-                                                   during multitask performance, spanning both affective response
   state functional connectivity associated with affective responses or processing speed,                                               and cognitive processing domains within a unified architecture.
   we first calculated the optimal direction of weight parameter changes in the main                                                    This integrative approach provides a unified framework for
   network (affective or cognitive vectors). We then derived the necessary resting-state                                                individual differences in functional domains relevant to psy-
   functional connectivity manipulations using gradient calculations (SmoothGrad)                                             ~~ chiatric conditions while establishing a direct link between
   within the hypernetwork. See Materials and Methods for further details. This figure                                                  individual biological characteristics and behavior for treatment
   shows the average gradient values for all participants. For clarity, only connections
   with gradient values exceeding 2.5 SDs from the mean are displayed. The line                                               line      simulations.
   thickness represents the magnitude of the deviation from the mean (SD).                                                                      The main network of our digital twin brain system success-
                                                                                                                                        fully predicted behavior in response to task stimuli with high
   within the prefrontal cortex, between temporal and subcortical                                                                       accuracy. The prediction accuracy for individual response
   regions, and between parietal and subcortical regions (Fig.  4 C)                                                                    choices across Emotional Faces and Stroop tasks was high,
   and the weakening connectivity between bilateral motor areas                                                                         with concordance rates of 0.90 to 0.94. Corresponding correla-
   (Fig.  4 D). The detailed lists of the top 10 connections with the                                                                   tion coefficients, calculated for comparison with previous
   highest gradient magnitudes for each direction (strengthening/                                                                       studies, were 0.88 to 0.89, notably exceeding the range (0.16
   weakening) are provided in Tables S2                                                                  and S3   . These findings      to 0.57) reported in those studies, which predicted behavior
   demonstrate the potential of this digital twin brain approach                                                                        and  cognitive  scores  from  resting-state  connectivity  [  31 –  35 ].
   for designing precise, domain-specific connectome interven-                                                                          Furthermore, the correlation between observed and predicted
   tion strategies based on the integrative modeling of an indi-                                                                        reaction times across these tasks demonstrated high value
   vidual’s  connectome,  neural  activity,  and  action.                                                                               ranges (0.85 to 0.90), outperforming previous research on
                                                                                                                                        reaction time prediction from neurophysiological indicators,
   Simulation of individual functional modulations                                                                                      which reported correlation coefficients of 0.09 to 0.80 [  36 ,  37 ].
                                                                                                                                        These high prediction accuracies demonstrate the effective-
   To predict responses to personalized perturbations, we simu-                                                                         ness of our approach, in which the hypernetwork generates
   lated the effects of the identified manipulations on individual                                                                      personalized parameters for the main network based on
   participants. For each participant, the weight parameters of the                                                                     individual rsFCM data, thereby enabling the main network
   main network were modified along the direction of the affective                                                                      to capture and reproduce participant-specific behavioral
   or cognitive vectors. Using these parameters, a postmanipula-                                                                        characteristics.
   tion main network was constructed to generate new predic-                                                                                    We further analyzed the relationship between model predic-
   tions of the action and BOLD signals in response to the sensor                                                                       tions and participant baseline performance. First, we found
   input. A comparison of the functional indicators (affective                                                                          that the model–participant concordance rate was positively
   response and processing speed) calculated from these pre-                                                                            correlated with baseline accuracy (r  > 0.76), implying that
   dicted actions and BOLD signals before and after the manipu-                                                                         model performance depends on the individual’s competency
   lation (Fig. 5  A to F) revealed intervention effects in most                                                                        level (Fig. S2   ). Second, the distribution of concordance rates
   individuals. Manipulation targeting the affective response                                                                           suggested that the model successfully learned the individual’s
   reduced the amygdala response strength (Fig. 5  A), while                                                                            systematic tendency to commit errors (i.e., error probability)
   manipulation targeting processing speed shortened reaction                                                                           rather than overfitting to the specific timing of stochastic errors.
   times (Fig.  5 B and C). Importantly, substantial interindividual                                                                    Third, the model’s average accuracy closely matched that of the
   variability was observed in the magnitude of these intervention                                                                      participants (e.g., emotion: 0.96 versus 0.97), confirming that
   effects (Fig.  5 D to F); individual effect sizes ranged widely, from                                                                the proposed model does not act as an idealized agent that
   negligible (approximately 0 SD) in some participants to large                                                                        solves tasks perfectly but rather faithfully replicates the specific
   (>2 SD) in others. This heterogeneity in simulated outcomes,                                                                         level of cognitive performance of each individual (Fig.  S3 ).

   Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                                                                            7










Processing   Affective
speed        response

               [t-statistics in GLM]
Frequency     Amygdala response





Frequency    Reaction time (ms)






Frequency     Reaction time (ms)










                                                                       Affective response                                        Processing Speed
    A                                                                      Emotional Faces task      B                           Emotional Faces task     C     Stroop task
                                                                 20                     \         1,400                                                1,400                     \_
                                                                 10                 RA           E                                                                                 NNN
                                                                                                                                                                          ION
                                                                                    SOY          A                                                     1,000              XT
                                                                                    RS
                                                                  0                          |    1,000      =\~                                                                     ~~
                                                                                    aS )         ARO N\                                                                          = == \
                                                                                    Ss NN       4        =                                               600              =
                                                                -10                                 600                                                                            =

                                                                                   Pre       Post                           Pre  Post                           Pre                              Post
      D                                                                                          E                                                          F
                                                                     25                                  40                                                 50
                                                                     20                                  30                                                 40
                                                                     15                                  20                                                 30
                                                                     10                                                                                     20
                                                                      5                                  10                                                 10
                                                                       0   0        1        2  3         0    0              1  2                            0
                                                                           Effect size (SD)        Effect size (SD)3                 4                          -1     Effect 0     size (SD)1   2   3

    Fig. 5. Interventional effects on individual functional indicators. (A) Pre- versus postmanipulation amygdala responses (t-statistics; affective response indicator) during the
    Emotional Faces task. Outward half-violin plots show the pre (left half) and post (right half) distributions; the thin gray lines connect paired pre–post values for each participant,
    visualizing individual changes in the indicator. (B) Pre- versus postmanipulation reaction times (in milliseconds; processing speed indicator) during the Emotional Faces task.
    (C) Pre- versus postmanipulation reaction times (in milliseconds) during the Stroop task. (D to F) Histograms showing the distribution of standardized effect sizes across
    individuals for amygdala responses (D), Emotional Faces task reaction times (E), and Stroop task reaction times (F). Effect sizes were calculated as ([Premanipulation Value]
    − [Postmanipulation Value]) / Premanipulation SD, such that positive values indicate reduced amygdala response or shortened reaction time. Therefore, effect sizes are in
    SD units. The dashed vertical lines indicate a large effect size (Cohen’s d = 0.8), serving as a benchmark for substantial intervention effects.

      To further evaluate the model’s potential for broad applica-                                                               weights from a lower-dimensional latent space. This implicit
    bility, we tested its performance on unseen participants (cross-                                                             regularization, combined with explicit dropout and data aug-
    participant generalization; see Table  S4  and Methods  S1 ). The                                                            mentation via sequence segmentation, ensured that the model
    model successfully predicted action choices (>87% accuracy)                                                                  learned robust, generalized dynamics rather than memoriz-
    and BOLD patterns (r > 0.83) for new individuals based solely                                                                ing noise. Consequently, the model achieved high generaliza-
    on their connectomes. However, the prediction of reaction                                                                    tion performance on unseen test data within individuals and
    times for unseen participants was less precise (r≈     0.36  to  0.42)                                                       robustly reproduced population-shared features (e.g., action
    compared to the model generalized within the same individual                                                                 choices and BOLD patterns) in cross-participant evaluations.
    (r > 0.85). While these values are comparable to or exceed                                                                   However, capturing highly variable individual traits such as
    typical connectome-to-behavior correlations reported in previ-                                                               reaction times in a zero-shot setting remains a challenge for
    ous studies [ 38                                                       , 39    ], the drop in performance highlights the     future scaling.
    difficulty of inferring fine-grained temporal dynamics exclu-                                                                       To  validate the necessity of the hypernetwork architec-
    sively from static connectomes with the current data scale.                                                                  ture, we critically compared it against alternative modeling
    We clarify that, at this stage, this level of prediction accuracy                                                            approaches, focusing on the distinction between shared versus
remains a research limitation regarding immediate clinical util- individualized weight spaces. First, theoretical considerations
ity for patient stratification. We suggest that future work utiliz- suggest that treating connectome features as additive inputs to
ing larger datasets may help address this challenge, potentially a shared network (as in standard RNNs) merely provides
    enabling precise behavioral prediction directly from the con-                                                                static bias shift  ht =  Winxt + Wrecht−1 + Wcc + b               a a
                                                                                                                                                                                                     ,  whereas
    nectome without the need for within-individual training.                                                                     the hypernetwork allows the connectome               to modulate the
    Despite the relatively large number of parameters in the                                                                     weights multiplicatively  ht =  Win(c)xt + Wrec(c)ht−1 + b             .
    main network compared to the sample size, our multifac-                                                                      We hypothesize that psychiatric heterogeneity involves alter-
    eted regularization strategy effectively mitigated overfitting.                                                              ations in circuit dynamics that require this multiplicative
    Specifically, the hypernetwork’s bottleneck architecture signifi-                                                            modulation, consistent with studies highlighting the superior
    cantly reduces the effective degrees of freedom by generating                                                                representational  power  of  multiplicative  interactions  [  40 ,  41 ].

    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                                                                       8

Indeed, our empirical comparison with a “direct input” model these previous approaches by developing a digital twin system
confirmed that additive inputs were less effective in capturing that integrates individual static connectomes, captures sen-
individual behavioral variability in our task setting (e.g., reac- sory–behavioral–neural dynamics, and enables the simulation
tion time correlation r ≈     0; see Fig.  S4 , Table  S5 , and Methods of intervention effects. This integrated approach highlights the
S2  ). Second, while fine-tuning models with individual behav- novel contribution of our research in understanding complex
ioral data is a powerful strategy for personalization [ 42  ], it psychiatric disorders and developing personalized treatment
requires collecting extensive task performance data from strategies.
each patient. In contrast, our hypernetwork offers the poten- Furthermore, we identified connectome changes through
tial for “zero-shot” generation of personalized models solely gradient calculations within the hypernetwork that efficiently
from resting-state connectomes (similar to one-shot learning affected specific functional indicators in the model. For the affec-
approaches [  43 ]). While further scaling of data may be required tive domain, manipulations weakening connections between the
to fully realize this potential for all behavioral metrics, this limbic, subcortical, parietal, and temporal regions were associ-
capability is essential for our goal of designing gradient-based ated with impacts on affective responses, supporting previous
interventions without preexisting behavioral data. research suggesting that networks centered around the amyg-
     As demonstrated by the model’s ability to predict perfor- dala in the limbic system may trigger excessive emotional
mance across both the Emotional Faces and Stroop tasks, responses  [  49 –  52 ].  For  the  cognitive  domain,  connections
embedding these tasks in a single generative model confers between the prefrontal cortex, motor cortex, parietal lobe, and
distinct advantages over the conventional “one-task-per-model” subcortical regions have been suggested to contribute to pro-
paradigm. First, it elucidates context-dependent interactions cessing speed, which aligns with existing fMRI studies indicat-
between functional domains. By modulating the shared con- ing that these networks are important attentional networks for
nectome-derived parameters, we observed that interventions processing  speed  [ 8 ,  53 –  56 ].  These  findings  suggest  the  -possibil
targeting affective responses did not generalize to processing ity of individualizing manipulation strategies that target specific
speed during the affect-neutral Stroop task (r  < 0.01) but functional indicators across cognitive and affective domains.
showed a positive coupling during the Emotional Faces task It is important to distinguish between the clinical validity
(r = 0.12; Fig.  S5 ). This reveals that affective circuits may modu- of our target parameters and the generative nature of our simu-
late cognitive processing speed specifically under negative lations. The correlations between model-derived latent vectors
valence contexts—a mechanistic nuance invisible to single-task and clinical scores (Table 1  ) serve to validate that the model
models. Second, a unified architecture is a prerequisite for mul- captures biologically relevant dimensions of psychopathology.
tiobjective optimization. Since clinical cases often involve co- Building on this validation, our in silico perturbation experi-
occurring deficits, our framework allows for gradient-based ments (Fig. 5  ) demonstrate a direct generative link: specific
searches that optimize global therapeutic outcomes across manipulations of the connectome input result in directional
multiple domains, identifying interventions that balance trade- changes in behavioral and neural outputs. While these “func-
offs rather than improving one symptom at the expense of tional modulations” do not directly equate to clinical cures,
another. While our framework enables such multiobjective they provide a mechanistic framework for identifying candidate
optimization, our results also highlighted the heterogeneity of interventions that can perturb the brain system from a patho-
patient responses. Simulating individual intervention effects logical state toward a desired functional profile.
via manipulations confirmed significant interindividual vari- However, we acknowledge   that translating these in silico
ability in treatment response, a phenomenon also commonly connectome manipulations into physical interventions poses
seen in clinical practice [ 18 ,  44 ,  45 ]. In the context of our digital challenges. Current noninvasive brain stimulation techniques
twin brain system, several factors may contribute to the (e.g., transcranial magnetic stimulation) or neurofeedback can-
observed individual differences: (a) variations in individual not yet manipulate individual functional connections with the
rsFCM patterns; (b) ceiling effects due to differences in baseline granular precision simulated in our model. Nevertheless, iden-
reaction times and amygdala responses; (c) the direction of tifying these optimal connectivity patterns serves as a crucial
affective and cognitive vectors extracted by PLS being opti- theoretical roadmap for future therapy. Furthermore, emerging
mized at the population level and not necessarily optimal for evidence from lesion network mapping and stimulation studies
each individual; and (d) the nonlinearity of the main network suggests that focal interventions on specific “hub” regions can
weight parameter space. These findings underscore the need propagate to induce widespread network-level reorganization
to predict individual treatment effects and highlight future [ 22 ,  57 ,  58 ].  Thus,  the  complex  connectivity  changes  predicted
challenges in optimizing parameters for each individual. by our digital twin might be practically realizable by targeting
  There has been growing interest in modeling individual   a few key nodes that drive these desired global network dynam-
neural activity dynamics and their relationship with higher- ics, rather than manipulating each connection individually.
order  brain  functions  in  recent  years  [ 10 , 11 ,  46 ,  47 ].  However,
        Our study has some limitations. First, the sample size (139
many of these studies have been limited to analyzing the cor - individuals with psychiatric disorders and 89 healthy controls)
relations between modeled brain activity and behavioral met- might not have fully captured the diversity and individual dif-
rics, without capturing the sequential generation of brain ferences under psychiatric conditions. Second, the tasks were
activity and behavior in response to sensory inputs, or their limited to Emotional Faces and Stroop paradigms. In addition,
interactive dynamics. Furthermore, while studies by van Bueren because of dataset constraints, we evaluated generalization
et al. [ 19 ] and Sun etal.  [  48 ] have attempted to optimize stimu- using a temporal split within a single session; future research
lation interventions for individual brain networks, these efforts utilizing longitudinal datasets is required to verify the model’s
have primarily focused on inducing specific brain activities, generalization across different days and sessions. Third, our
with limited evaluation of higher-order functions involving analyses relied on functionally defined brain atlases (Schaefer,
sensory processing and behavior. In contrast, our study extends Tian, and Buckner atlases) as provided by the preprocessed

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231 9

    dataset. While these atlases ensure high functional homoge-           Stroop task (n = 5) were excluded from the reaction time and
    neity within regions, future studies should assess the model          accuracy analyses for the respective tasks.
    using structurally defined atlases (e.g., Desikan–Killiany or                                                                 For        all participants, BOLD signals, sensory inputs, and
    Brainnetome) to evaluate the robustness of the findings across        action data were recorded for 394.6 s during the Emotional
    different parcellation schemes, as parcellation choice is known       Faces task and 407.2 s during the Stroop task. These data were
    to influence connectome-based prediction performance [ 59        ],   split into training and testing sets for the training and evalua-
    and to better elucidate the relationship between anatomical           tion of the digital twin system. For each task, the first 196.8 s
    constraints and functional dynamics. Fourth, this study pri-          of data were used as the training set, and the subsequent 196.8 s
    marily focused on the mesoscopic scale, examining con-                of equal length was used as the testing set. This temporal
    nectivity between brain regions, whereas the brain exhibits           division allowed us to evaluate the model’s ability to predict
    a multiscale structure from the molecular and cellular levels         behavior and brain activity in response to test sensory inputs,
    to  large-scale  networks  [ 9 ,  60 –  62 ].  Incorporating  microscopic
                                                                          thereby enabling us to assess within-participant generalization
    models (at the ion channel and receptor levels) could poten-          capability.
    tially extend our approach to simulating pharmacological inter-                                                              This        secondary analysis of deidentified data was approved
    ventions and other treatment modalities.                              by the Institutional Review Board of the National Center of
        Despite     these limitations, the digital twin brain system      Neurology and Psychiatry (IRB no. A2021-119).
    developed in this study has significant potential for future
    advancement. A key strength of our model, compared to con-            Tasks
    ventional individual brain models, is its ability to learn flexibly
    using artificial neural networks. As it uses sensory inputs and         We utilized 2 standard fMRI paradigms to probe distinct func-
    behavioral outputs similar to the actual brain, future work           tional domains.
    could potentially reproduce sensory and behavioral input–                                                                               •  Emotional Faces task: To assess the Negative Valence
    output patterns not only in specific cognitive and emotional                                                                             Systems domain, we used a matching task adapted from
    tasks but also throughout an individual’s daily life activities.                                                                         Hariri et  al. [25]. Participants matched a target image
    Although we have adopted simple RNNs to capture the sequen-                                                                              (either an emotional face or a geometric shape) to 1 of
    tial nature of brain processing, there is value in exploring more                                                                        2 probe images. We focused on trials involving negative
    advanced models, such as long short-term memory (LSTM)                                                                                   facial expressions (e.g., anger and fear) to elicit amygdala
    networks, gated recurrent units (GRUs), graph neural net-                                                                                reactivity [26,64].
    works and transformers (and emerging state space models),                                                                               •  Stroop task: To assess the Cognitive Systems domain
    for modeling large-scale data and long-term dependencies.                                                                                (specifically cognitive control and processing speed), we
    Furthermore, by developing methods to analyze the structure                                                                              used a classic color-word Stroop task [65]. Participants
    of individual parameter spaces and search for optimal interven-                                                                          identified the ink color of color-words presented under
    tion directions tailored to each person, we expect to pave                                                                               either congruent (matched) or incongruent (mismatched)
    the way for personalized medicine adapted to psychiatric                                                                                 conditions. The Stroop effect, characterized by reaction
    symptoms and diverse cognitive characteristics. In addition,                                                                             time interference in incongruent trials, serves as a robust
    integrating microscopic level modeling could enable more                                                                                 measure of cognitive flexibility and inhibition [66,67].
    comprehensive simulations that incorporate the effects of phar-
    macological therapies and genetic factors. Through these exten-
    sions, the digital twin brain system presented in this study is       fMRI data preprocessing in public datasets
    expected to serve as an increasingly powerful platform for            For the public dataset (TCP), fMRI data acquisition, prepro-
    elucidating the pathophysiology of psychiatric disorders and          cessing (including noise removal), and brain region parcellation
    predicting  individualized  treatments.                               were performed following the standard procedures. For detailed
                                                                          information, please refer to the data release paper [ 63 ]. MRI
    Materials and Methods                                                 data were acquired at both facilities using calibrated Siemens
    Dataset                                                               3 T                                                               MAGNETOM Prisma scanners with 64-channel head coils.
                                                                          All fMRI runs adhered to the Human Connectome Project
    We      used data from the publicly available TCP dataset [ 63   ].   (HCP) protocol, consisting of 488, 510, and 493 volumes for
    The TCP dataset consists of 241 participants, including indi-         the resting state, Stroop task, and Emotional Faces task, respec-
    viduals with a wide range of mental disorders and healthy             tively. The common fMRI sequence parameters were repetition
    controls, recruited between 2019 November and 2023 March.             time (TR) = 800 ms, echo time = 37 ms, flip angle = 52°, voxel
    We accessed preprocessed BOLD signal data, parcellated by             size = 2 mm, and multiband acceleration factor = 8. Functional
    brain region, and the corresponding behavioral data. For this         scan slices were automatically aligned parallel to the anterior–
    study, we used data from 228 participants (139 with mental            posterior (AP) commissure plane and centered on the brain.
    disorders and 89 healthy controls) for whom resting-state             B0 field maps in the AP/posterior–anterior directions were
    BOLD signals, task-related BOLD signals, behavioral data, and         acquired for distortion correction; however, this study utilized
    clinical information were available. The age of the participants      AP direction data from the resting state, Emotional Faces task,
    ranged from 18 to 68 years (mean =  34.0, SD = 13.0), with            and Stroop task.
    97 males and 128 females included. Data for the Emotional                     MRI data were preprocessed using the HCP Pipeline [            68      ]
Faces task were available for 95.6% (n = 218) of the participants, (version 4.7.0), involving minimal processing and noise removal.
and data for the Stroop task were available for 98.2% (n=  224) Tools from the FMRIB Software Library and FreeSurfer [ 69  ]
    of the participants. Participants whose accuracy rates were           were primarily utilized. Structural MRI processing included
    below the chance level on the Emotional Faces task (n=  5) and        the alignment of T1-weighted/T2-weighted images from each

    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                   10

participant’s native space to the Montreal Neurological Institute                                             Preprocessing of sensory, task condition,
(MNI) space, correction for distortion and inhomogeneity, sur-                                                and action data
face registration based on FreeSurfer and Conte69 atlases, and                                                  We prepared sensory inputs, task condition inputs, and action
downsampling to 2 mm. The fMRI volume processing involves                                                     outputs from Emotional Faces and Stroop tasks as time-series
spatial distortion correction, motion correction (FMRIB’s Linear                                              data suitable for training the main network model. The time
Image Registration Tool registration), bias field correction, and                                             interval (temporal resolution) of the time-series sequences was
normalization. For fMRI surface processing, 4-dimensional                                                     set at 0.08 s to represent individual differences in reaction time
volume time-series data were converted to standard gray ordi-                                                 and to align with the original TR of 0.8 s in the fMRI data.
nate surface data and aligned along the tissue contours using                                                 Sensory inputs are represented in 8 dimensions, task conditions
HCP algorithms. Surface data were smoothed and aligned across                                                 in 1 dimension, and action outputs in 3 dimensions.
participants using MSMAll [  70 ], which utilizes features such                                                                                                                  Sensory inputs represented the visual stimuli in 8 dimen-
as cortical folding. In addition, ICA-FIX [ 71     ] was applied to                                           sions for both tasks. In the Emotional Faces task, these 8
remove noise sources, such as motion and scanner drift, using                                                 dimensions were fully utilized. First, we used 2 dimensions to
classifiers pretrained on HCP data. Global signal regression has                                              represent cue stimuli (“match faces” or “match shapes”). During
also been implemented for noise control in fMRI time-series                                                   cue presentation, a value of “1” was input to the corresponding
data and improvement        of action prediction models.                                                      dimension and “0” when not presented. Next, we represented
 To calculate the functional connectivity, dense CIFTI time-                                                  the facial stimuli at the top, bottom left, and bottom right of
series data with 91,282 vertices were parcellated into 446 brain                                              the screen using 2 dimensions each, for a total of 6 dimensions.
regions encompassing the cortical, subcortical, and cerebellar                                                When no facial stimuli were present, all 6 values were set to
areas. This was accomplished by averaging the functional time-                                                “0”; during presentation, values drawn from a uniform distribu-
series data within each region. Cortical parcellation utilizes a                                              tion of [0, 0.1] or [0.9, 1] were used to represent individual and
400-region surface-based functional atlas [  72 ]. The subcortical                                            emotional differences in facial expressions. Regarding shape
regions were parcellated into 32 laterally symmetric regions                                                  stimuli (ellipses), when none were present, all 6 values corre-
using the atlas of Tian et al. [ 73     ]. The cerebellum was parcel-                                         sponding to the 3 locations were similarly set to “0”. During
lated into 14 regions using the atlas of Buckner et al. [  74 ].                                              shape presentation, information about the ellipses’ different
fMRI data preprocessing for experiments                                                                       orientations was encoded using combinations of “1” and “0”.
  To create rsFCMs, we utilized correlation matrices between 446                                              This information was assigned to the same 6-dimensional ele-
brain regions from the publicly available dataset. Specifically,                                              ments corresponding to the top, bottom-left, and bottom-right
we calculated the Pearson correlation coefficients between                                                    locations used for the facial stimuli (2 dimensions per location).
regions from each participant’s BOLD signal data. The upper                                                   In the Stroop task, 6 of 8 dimensions were used to represent
triangular elements of the resulting correlation matrices were                                                visual stimuli. Specifically, 3 dimensions represented the color
extracted and transformed using Fisher’s z -transformation,                                                   of the presented characters (red, green, and blue), and 3 dimen-
representing the rsFCMs as vectors with 99,235 elements.                                                      sions represented the text of the characters (red, green, and
                                                   For      BOLD signal data during the Emotional Faces and   blue). When no characters were presented, these 6 dimensions
Stroop tasks, we selected 20 brain regions that provided com-                                                 were set to “0”; during presentation, a value of “1” was input
prehensive coverage of the brain to reduce computational costs.                                               to the dimension corresponding to the presented color or text.
These regions included the bilateral anterior prefrontal cortex,                                              The remaining 2 dimensions of the sensory input were always
ventrolateral prefrontal cortex, premotor cortex, primary motor                                               set to “0” during the Stroop task.
cortex (M1), primary sensory cortex (S1), superior parietal cor-                                                  The task condition input, which remained constant over
tex, auditory cortex, higher visual cortex, primary visual cortex                                             time for each respective task, was a one-dimensional identifier
(V1), and amygdala (Table  S6 ).                                                                              set to “0” during the Emotional Faces task and “1” during the
Regarding temporal resolution, while the original BOLD                                                        Stroop task.
signal data had a TR of 0.8 seconds, we resampled the data to                                                                                                                  Action outputs were represented in 3 dimensions for both
0.08-s (10-fold) intervals using cubic interpolation to align                                                 tasks. In the Emotional Faces task, 2 dimensions were used:
the temporal intervals with sensory and behavioral data. We                                                   one for left button presses and another for right button presses.
emphasize that this resampling does not increase the intrinsic                                                When a button was pressed, a value of “1” was assigned to the
temporal resolution of the BOLD signal. To assess robustness                                                  corresponding dimension, and “0” otherwise. The third dimen-
against potential interpolation-induced artifacts, we performed                                               sion was always set to “0”. In the Stroop task, all 3 dimensions
2 additional validation analyses: (a) GLM analyses using only                                                 were utilized: one dimension for each of the red, green, and
predicted BOLD values sampled at the original acquisition time                                                blue button presses. When a button was pressed, a value of
points (TR =  0.8 s), excluding all interpolated frames, and                                                  “1” was assigned to the corresponding dimension, and “0”
(b) full model retraining using linear interpolation instead                                                  otherwise.
of cubic interpolation. Results of these analyses are reported                                                Clinical symptom measures
in Fig.  S6  and demonstrate that prediction performance and                                                  As part of the treatment intervention simulation, correlations
spatial response patterns are robust to the choice of interpola-                                              were examined between the affective and cognitive vectors
tion scheme.                                                                                                  derived from the model and the clinical symptom scores of
   Finally, for data normalization, we calculated the mean and                                                the actual participants. These clinical symptom scores were
SD across all participants and time steps for each brain region                                               included in the TCP dataset and assessed using an evaluation
in the training data and applied z-score normalization. The                                                   battery that was administered across 3 testing sessions. The
means and SDs derived from the training data were used to                                                     evaluation battery encompassed a wide range of domains,
normalize the test data.                                                                                      including function, lifestyle, emotion, mental health, cognition,

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                                                         11

   environment, personality, and social factors. These include                                                                                                                                              The Mish activation function is defined as follows:
   multiple commonly used clinical tools, scales that capture
   unique aspects of experience, general cognitive function mea-                                                                                                                                                                                     Mish(u) = u ⋅ tanh softplus(u)                       (4)
   surements, and self-report scales. The specific clinical measures
   investigated for correlations with the affective and cognitive                                                                                                                                                          softplus(u) = ln1 + exp(u)
   vectors are listed in Table  S1 .                                                                                                                                                                                                                                                                      (5)
   Model overview                                                                                                                                                                                         Through                                               these operations, the hypernetwork generates
                                                                                                                                          the main network parameters from the individual rsFCMs,
   The                   proposed digital twin brain system comprises a dual-                                                             enabling  personalized  modeling.
   component architecture consisting of a hypernetwork and a
   main network, designed to reproduce brain dynamics specific                                                                            Main network
   to an individual. The hypernetwork takes the brain connec-                                                                             The main network consisted of an RNN and fully connected
   tome represented by each participant’s rsFCM as input and                                                                              layers designed for time-series data processing. At each time
   uses an MLP to generate the weight and bias parameters for                                                                             step  t, the combined input of sensory information and task
   the main network ( W main).    The main network, based on                                                                              condition, denoted as  x(i)                                                                                     (t)   ,  for  participant i
   individual-specific parameters supplied by the hypernetwork,                                                                                                                                                                       main                               is fed into a
   receives a combined input of the sensory input  sensor(t)                                                                              simple RNN with N hidden_main    hidden units. We selected a stan-
   and the task condition at each time point and sequentially                                                                             dard vanilla RNN architecture to serve as a parsimonious
   updates its internal hidden state to simultaneously output                                                                             model of neural population dynamics (firing rates), a widely
                                                                                              (t + 1)    and predicted BOLD signal        adopted  approach  in  computational  neuroscience  [  75 ,  76 ],
   the predicted action action
    (t + 1)    for the next time point. This model was trained                                                                            tion over more complex gated architectures like LSTMs or
   BOLD                                                                                                                                   favoring its simplicity and established biological interpreta-
   end to end under a loss function that included prediction                                                                              GRUs. We denote the hidden state of this RNN at time  t     by
   errors for both actions and BOLD signals. Overall, this system                                                                         h                                                          (i)              (t) ∈ ℝN                                            , which is updated according to
   offers a flexible and efficient framework for directly predicting                                                                                                                                 main                  hidden_main
   individual brain dynamics based on participant-specific net-
   work  properties.                                                                                                                      hmain(i)                                                                    (t) = tanh  W ih(i)x(maini) (t) + b(ihi) + W hh(i) h(maini)    (t − 1) + bhh(i)       .
                                                                                                                                                                                                                                                                                                         (6)
   Hypernetwork                                                                                                                                                                                             Here, W (ihi)         ∈ ℝNhidden_main×Nˢᵉⁿˢᵒʳ                and b(i) ∈ ℝN    hidden_main        are
   The hypernetwork [ 23 , 24 ], which generates parameters for the                                                                                                                                                                                                      ih
main network, consists of an MLP. The input layer contains N in    the weight matrix and bias vector from input to hidden layer,
units and receives an input vector x hyper(i)     x(( i) ∈ ℝN    ),  which while W (hhi) ∈ ℝNhidden_main×Nhidden_main    and b(i) ∈ ℝNhidden_main    are
                                                                                                   hyper     in                                                                                                                                                          hh
   represents the rsFCM of the participant  i   .  To  prevent  overfit-                                                                  the weight matrix and bias vector from hidden to hidden layer.
   ting, a dropout layer with a rate  d    is applied to the first layer.                                                                                                                                   The hidden state h (maini)     (t)    is then input into a fully connected
This is followed by 2 hidden layers, each containing N hidden_hyper    layer to obtain the final output  y(maini) (t + 1)   .  From  this  output
                                                                                                                                                                                                                                                                                              (i)(t + 1)
   units with Mish activation functions. The final output layer                                                                           vector  y(i)                                                                     (t + 1)   , we obtain the predicted action action
   contains N                                                                          units, which correspond to the total num-                                                                                       main
                         params_main                                                                                                      and BOLD signals BOLD
   ber of learnable parameters in the main network, as described                                                                                                                                                                      (i)(t + 1)    by appropriately dividing its
   below.                                                                                                                                 dimensions. Formally,
                     The computational flow through the hypernetwork can be                                                                                                                                           y(i)                     (i)
   expressed by the following equations:                                                                                                                                                                               main(t + 1) =         action              (t + 1)  ∈ ℝNᵃᶜᵗⁱᵒⁿ+Nᴮᴼᴸᴰ,               (7)
                                                                                                                                                                                                                                              BOLD
                         h(1i)                                                    = Mish      W 1x(hyperi) + b1              (1)          where  N                                                                         and                                (i)(t + 1)
                                                                                                                                          BOLD action                                                                                                             NBOLD are the dimensions of the action and
                                                                                                                                                                                                                       signals, respectively. The fully connected layer computed
                         h2(i)                                                    = Mish       W 2h(1i) + b2                 (2)
                                                                                                                                                                                                                           ymain(i)            (t + 1) = W(hoi) hmain(i)  (t) + b(hoi)                    (8)
                                                                                  yhyper(i)   = W 3h2(i) + b3                (3)          where  W(hoi)                                                                    ∈ ℝ(Naction+NBOLD)×Nhidden_main    and b (hoi)                ∈ ℝNaction+NBOLD
   where  h(1i)    h(1( i)     ∈ ℝNhidden_hyper)    is the output of the first fully                                                      are the weight matrix and bias vector from hidden to output
   connected layer, h (2i)    h(2( i)                                             ∈ ℝNhidden_hyper   ) is the output of the sec-          layer, respectively.
   ond fully connected layer, and  y(hyperi)                                                           y(( i)    ∈ ℝNparams_main   )  is                                                             The                                   output of the hypernetwork  y(hyperi)     corresponds  to  a
   the final output. The weights and                                                               hyper                                  concatenated vector of all learnable parameters in the main
                                                                                               biases for each layer are                  network ( W(i)   b, (i)    W, ( i)    b, (i)    W,                                                                         ( i)    b, (i)    ),  where
   defined as follows: W                                                          1 ∈ ℝNhidden_hyper×Nin    and b1  ∈ ℝNhidden_hyper                                                                                    ih        ih                         hh hh   ho   ho              Nparams_main
for the first fully connected layer; W 2 ∈ ℝNhidden_hyper×Nhidden_hyper    represents the total number of these parameters. The matrix
       formed by vertically stacking these concatenated vectors of all
and b 2 ∈ ℝNhidden_hyper    for the second fully connected layer; and learnable parameters in the main network for all participants
   W                                                3 ∈ ℝNparams_main×Nhidden_hyper    and b3  ∈ ℝNparams_main    for  the  out-          is denoted as W                                                                         main    W( main ∈ ℝNᵖᵃʳᵗⁱᶜⁱᵖᵃⁿᵗˢ×Nparams_main   ),  where
   put layer.                                                                                                                             N                                                                                       participants    is the total number of participants.

   Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                                                                                                                                                                              12

Loss function                                                                                                                                  in preliminary studies that validation loss showed a consistent
For network           training, we used a combined loss function that                                                                          downward trend and plateaued, indicating negligible further
incorporated 2 objectives: action prediction and BOLD signal                                                                                   reduction and no signs of overfitting (Fig.  S1 ).
prediction. We applied the binary cross-entropy loss for the                                                                                       To      validate these architectural choices and the weighting
action prediction component and the mean squared error loss                                                                                    coefficients, we conducted a post hoc systematic sensitivity
for the BOLD signal prediction component, with each loss                                                                                       analysis on a representative subset of the dataset (N      = 50)
weighted by a coefficient and then summed.                                                                                                     trained for 300 epochs. First, we explored the search space for
                 The loss function for action prediction, denoted as                                                     Laction   ,           the main network’s hidden size (100, 200, 400, and 500), the
is defined for predicted actions action                                                                                                        hypernetwork’s hidden size (100, 200, and 300), and the drop-
action                (i)(t)    as  follows:                                                     (i)(t)    and  observed  actions out rate (0, 0.1, and 0.2). The results confirmed that the selected
                                                                                                                                               parameters ( N       =
                                                                                                                                                              400,       =
                                                                                                                                               0.1)       hidden_main            Nhidden_hyper     200, dropout =
                      1                                                         N                                                                      offered the optimal balance between validation loss reduc-
Laction = action Nbatch ⋅ T                                                     batch  ᵀ                                                       tion, computational efficiency, and generalization (see Table  S7
−action(i)(t)logaction i=¹                                                             ᵗ=¹                  for detailed comparisons). Second, we evaluated the robust-
                      (ⁱ)(t)                                                           − 1 −action(ⁱ)(t)     log   1 −action
                                                                                                           (ⁱ)(t)                              ness of the weighting coefficients ( action   , BOLD        )  by  comparing
                                                                                                                                (9)            the balanced setting against action-focused and BOLD-
                                                                                                                                               focused schemes. This analysis supported the balanced setting
                    Here,         represents the weighting coefficient for the                                                                 (           =
                                                                                                                                                   action       =
action                action                                                                                                                               BOLD     1) as essential for capturing both behavioral
                                                                           prediction loss. The summation is calculated across all             and neural dynamics simultaneously (Table  S8 ).
participants  i    and time steps  t   ,  where
participants per batch and T                                                                          Nbatch      is the number of                      The training data sequences were segmented into 262 time
                                                                                                  is the number of time steps.                 steps (20.96 s); this segmentation served as a data augmentation
                 The loss function for BOLD signal prediction, denoted as                                                                      strategy to increase the effective number of training examples.
L                     ,                                                         is defined for the predicted BOLD values  BOLD                 We used a batch size of 50 and the Adam optimization algo-
                BOLD                                                                                                       (i)(t)              rithm with a learning rate of  10−6. To further ensure robust
and observed BOLD values                                                                    BOLD    (i)(t)    as  follows:                     generalization despite the large number of generated param-
                      1                                                         N                                                              eters, we relied on the implicit regularization provided by the
                L     =                                                          batch      ᵀ BOLD                         ₂                   hypernetwork’s bottleneck architecture (generating weights
                 BOLD     BOLD Nbatch ⋅T                                         i=1        t=1      (ⁱ)(t) − BOLD(ⁱ)(t)       (10)            from 200 latent units), combined with the explicit dropout
                    Here, BOLD         represents the weighting coefficient for the                                                            (rate = 0.1). The maximum number of epochs was set to 800,
BOLD signal prediction loss. The total loss function L     is  defined                                                                         and early stopping triggered by validation loss monitoring was
as the sum of the action prediction loss and the BOLD signal                                                                                   used to prevent overfitting.
prediction loss.                                                                                                                               GLM analysis
                                                                                L = Laction + LBOLD                            (11)            To     quantitatively evaluate BOLD signal changes in response to
                    This equation was used to optimize the model by minimiz-                                                                   task stimuli, we conducted a GLM analysis, a method commonly
ing the prediction errors for both action prediction and BOLD                                                                                  used in brain fMRI analysis [ 63 ]. To assess neural activity in
signal  prediction.                                                                                                                            response to stimuli, we used face and shape conditions as regres-
                                                                                                                                               sors for the Emotional Faces task and congruent and incongruent
Hyperparameter settings                                                                                                                        conditions as regressors for the Stroop task. For each participant’s
The               input layer dimension (                                                    N)    of the hypernetwork corre-                  BOLD signal data, task events were temporally locked to the start
sponded to the number                                                                            in                                            of each trial, and the Glover function was applied as a canonical
99,235, representing the of elements in the rsFCM, which was                                                                                   hemodynamic response function (HRF). In addition, we included
                                                                                          upper triangular elements of the correla-            the first temporal derivative of the HRF in the regressors to capture
tion matrix between the 446 brain regions. As described in the                                                                                 temporal variations in the hemodynamic response. The design
“Preprocessing of sensory, task condition, and action data”                                                                                    matrix of explanatory variables also incorporated 8 basis functions
section, there were 8 sensory input dimensions (
condition dimension, 3 action output                                                                       Nsensor   ),  1  task               using the discrete cosine transform with a cutoff frequency of 0.01
and 20 BOLD output dimensions ( N                                                            dimensions (               Naction   ),           Hz to account for potential low-frequency signal drift, along with
the total number of learnable                                                                    BOLD  ).  With  these  settings, a constant term representing the baseline. This enhances the
( Nparams_main   )  is  173,623.                                                                             parameters in the main network    model’s robustness against high-frequency noise.
                                                                                                                                                      Individual-level       GLM analyses were conducted indepen-
                    Through preliminary studies heuristically exploring a search                                                               dently for each brain region using the least-squares method.
space that included hidden unit sizes (50, 100, 300, 400, and                                                                                  The primary contrasts of interest were “face condition > shape
600 for the main network and 100, 200, and 400 for the hyper-                                                                                  condition” for the Emotional Faces task and “incongruent con-
network), and dropout rates (0, 0.05, 0.01, and 0.3), we                                                                                       dition > congruent condition” for the Stroop task. Specifically,
selected a hidden unit size of 400 for the main network, 200                                                                                   we evaluated contrasts representing differences in regression
for the hypernetwork, and a dropout rate of 0.1. Furthermore,                                                                                  coefficients between conditions and calculated t-statistics by
the weighting coefficients for action and BOLD signals in the                                                                                  dividing the obtained contrast estimates by their standard
loss function ( action   , BOLD                                                              )                were both set to 1. These pre-   errors to determine statistical significance. The t-statistics for
liminary explorations focused on identifying a configuration                                                                                   the amygdala derived from these results were used in the
that ensured stable convergence. Regarding convergence cri -                                                                                   model-based functional indicator for the treatment interven-
teria, we confirmed through visual inspection of learning curves                                                                               tion simulation, as described later.


Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                            13

           For      group-level statistical inference, we conducted one-           represents the first latent variable of W                                 main    that has the stron-
    sample t tests (against 0) across all participants for each brain              gest association with the functional indicator s    .
    region, using t-statistics of contrasts obtained from individual-                                                    To identify the optimal intervention direction, specifically
    level GLM analyses. This approach enabled us to identify brain                 for affective response and processing speed, we conducted
    regions with significant group-level activity in response to the               separate PLS regression analyses. One analysis used affective
    task stimuli. The results are shown in Fig.  3 B.                              response data as a target functional indicator ( s   )  and  the  other
                                                                                   used processing speed data as s    . This approach yielded 2 distinct
    Assessment of functional indicators in the model                               coefficient vectors: v affective    (the coefficient vector correspond-
      In this study, we evaluated the functional indicators related to             ing to the affective response, also called the affective vector)
    emotional and cognitive processes, as reproduced within our                    and v cognitive    (the coefficient vector corresponding to processing
    model, by drawing a conceptual alignment with the RDoC                         speed, also called the cognitive vector). These vectors represent
    framework. These assessments are based on the action and                       the optimal directions in the main network parameter space
    brain activity sequences generated by the main network during                  that most efficiently influence the changes in each functional
    task performance. For the RDoC Negative Valence Systems                        indicator.
    domain, we quantified an indicator of affective response by                                                            To validate the v          and      vectors  obtained
    measuring the strength of amygdala responses in BOLD signal                    PLS analysis, we                          affective     vcognitive                           through
    sequences generated by the main network in response to nega-                                                                        calculated the Pearson correlation coefficients
    tive facial expression stimuli during the Emotional Faces task.                between each vector and the corresponding functional indica-
    The amygdala plays a central role in the emotional response                    tor s     across individuals. Strong negative correlations were con-
    networks [  50 ]. On the basis of the finding that the right amyg-             firmed for affective response (r (                                     = −0.59) and processing speed
    dala is particularly involved in processing negative emotions                      r = −0.68). These results indicate that modifying weight
    [  77 ], we used the response strength of the right amygdala, spe-             parameters ( W main   ) in the direction specified by v affective    leads
    cifically, the t-statistic obtained from the individual-level GLM              to a weakened amygdala response to negative facial expressions
    analysis mentioned earlier, as an indicator of negative affective              (representing the target impact on affective response), and
                                                                                   modifying them in the direction of v                                            leads
    response intensity in the model. We quantified an indicator for                reaction time (representing the           cognitive     to decreased
    the RDoC Cognitive Systems domain, specifically processing                     speed).                                                              target impact on processing
    speed, based on reaction times calculated from action sequences
    generated by the main network during Emotional Face and                        Investigation of optimal manipulation for rsFCM
Stroop tasks. Reaction time is known to correlate strongly with In   this study, we utilized affective and cognitive vectors to
    a wide range of cognitive functions [ 78   ] and serves as a key               examine manipulation strategies for rsFCM that efficiently
    measure of processing speed. Specifically, we calculated the                   affected affective responses and processing speed. These vectors
    time interval from the appearance of the visual stimuli to the                 represent the directions of change in the main network weight
    occurrence of button-press actions, considering that each time                 parameters ( W                            ) obtained from PLS analysis. To elucidate
    step in the sequence was 80 ms.                                                the changes in main
                                                                                   directions, we rsFCM that would shift W     main    along  these  vector
    PLS analysis                                                                   SmoothGrad [ applied                                         the gradient-based visualization method
      In this study, we applied PLS analysis to examine the relation-                                                        79 ] to the hypernetwork. SmoothGrad evaluates
    ship between the functional indicators (affective response and                 the importance of input elements by calculating the gradient
    processing speed) reproduced in the model and the weight                       of the output with respect to each input element. This method
    parameters of the main network. When the vector for a specific                 overcomes the limitations of simple gradient methods, which
                                                                                   are susceptible to noise, by adding small random noises to the
    functional indicator is denoted as s     s (
                        ∈ ℝNᵖᵃʳᵗⁱᶜⁱᵖᵃⁿᵗˢ   ),  the  objec-                         input multiple times and averaging the gradients of the output
    tive of PLS is to identify latent variables in the weight param-               for each noise-added input, thereby estimating robust impor-
eters of the main network (
maximize covariance W main ∈ ℝNᵖᵃʳᵗⁱᶜⁱᵖᵃⁿᵗˢ×Nparams_main   )  that tance values.
                        with this indicator. This is equivalent                                                            In our implementation, referencing the original SmoothGrad
    to finding a coefficient vector  v    that satisfies the following             recommendations [ 79 ], we input the rsFCMs of all participants
    condition. Prior to the PLS analysis, both the functional                      into the trained hypernetwork with a sampling frequency of
    indicator vector  s    and weight parameter matrix  W main    were             100 and a noise level of 0.1. To validate these choices, we per-
    standardized.                                                                  formed a sensitivity analysis with varying sampling frequencies
                     v = argmaxcovW mainu,s                           (12)         (50, 100, and 200) and noise levels (0.05, 0.1, 0.2, and 0.3).
                                                                                   We confirmed that the resulting group-averaged gradient
                        ‖u‖= 1                                                     maps were highly robust, with Pearson correlation coeffi-
             Specifically, the coefficient vector v     was calculated using the   cients exceeding 0.99 across all comparisons (Table  S9 ). Noise
    following formula:                                                             was generated following a normal distribution, with the SD
                        v = W Tmains                                               calculated by multiplying the SD of the rsFCM by the noise
                                                                                   level. Perturbed inputs were created by adding this noise to the
                            W Tmains                                  (13)         input data. Each noise-added input was passed through the
                                                                                   hypernetwork, and the outputs were z-score-normalized. We
             The coefficient vector v     indicates the direction in the weight–   then obtained the first latent variable ( z1   )  corresponding  to  the
                                                                                   cognitive and emotional vectors using PLS regression. The gra-
    parameter space of the main network, and the score vector                      dients of the input elements with respect to the value of the first
 z     z (
 1 1 = W mainv   ) obtained by projection onto this direction latent variable were calculated and averaged across all sampling

    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                                                        14

    iterations to determine the contribution of the inputs using                  Data Availability
    SmoothGrad. These averaged gradients indicate the degree of
    influence of each input element on the first latent variable, and             The raw neuroimaging data and all behavioral measures used
    serve as indicators for evaluating which elements of rsFCM are                in the TCP dataset are accessible through OpenNeuro ( https://
    important for changing W         main    in the direction of the affective    openneuro.org/datasets/ds005237 ). The raw and processed
    and cognitive vectors. In Fig.  4 A to D, to show the general trend           neuroimaging data and all behavioral measures will be made
    across all participants, we averaged the gradients obtained for               publicly available through the NDA ( https://nda.nih.gov/edit_
    rsFCM across the participants.                                                collection.html?id                                                   =3552 ). The code is publicly available at
                                                                                      https://osf.io/zuqf6/ .
    Prediction of individual treatment effects                                    Supplementary Materials
    based on simulation
    We          conducted a virtual treatment simulation to predict the                   Methods  S1  and  S2
    individual treatment effects by modifying the weight param-                     Figs. S1 to S8
    eters of each participant’s main network along the affective and                Tables  S1  to  S9
    cognitive vectors. The postmanipulation weight parameters of
    the main network for the  i   th  participant,
    sented by the following equation:      W ( maini,:)        ,  are  repre-     References
        W (maini,:)     = W main(i,:)     + vT                             (14)                                                                1.  Katsoulakis E, Wang Q, Wu H, Shahriyari L, Fletcher R, Liu J,
                                                                                                                                                   Achenie L, Liu H, Jackson P, Xiao Y, et al. Digital twins for
    where W  (maini,:)     represents the premanipulation weight parame-                                                                       2.  health: A scoping review. npj Digit Med. 2024;7(1):77.
    ters of the main network. The scalar value      represents  the                                                                                Wang HE, Triebkorn P, Breyton M, Dollomaja B,
    intensity of the manipulation, which was set to twice the SD of                                                                                Lemarechal J-D, Petkoski S, Sorrentino P, Depannemaecker D,
    the latent variable score  z1    in this study ( = 2SDz    ).  We  vali-                                                                       Hashemi M, Jirsa VK. Virtual brain twins: From basic
        1
    dated the appropriateness of this intensity through                a sensi-                                                                    neuroscience to clinical use. Natl Sci Rev. 2024;11(5):
tivity analysis, which confirmed a monotonic and clinically  3. Article nwae079.
    realistic dose–response relationship up to 2.5 SD (Fig. S7     ).                                                                              Aerts H, Schirner M, Dhollander T, Jeurissen B, Achten E,
    Furthermore, to ensure that the linear manipulation did not                                                                                    Van Roost D, Ritter P, Marinazzo D. Modeling brain dynamics
    lead to degenerate network behavior, we verified that task                                                                                     after tumor resection using the virtual brain. Neuroimage.
performance and action distributions were preserved after the  4. 2020;213:Article 116738.
    intervention (Fig.  S8 ). The vector v     is either the affective vector                                                                      Takahashi Y, Idei H, Komatsu M, Tani J, Tomita H,
    or the cognitive vector, indicating the direction in the weight                                                                                Yamashita Y. Digital twin brain simulator for real-time
    space of the main network that affects the affective response                                                                                  consciousness monitoring and virtual intervention using
    or processing speed.                                                                                                                       5.  primate electrocorticogram data. npj Digit Med. 2025;8(1):80.
        Using     the main network with postmanipulation weight                                                                                    Akil H. Computational psychiatry: New perspectives on mental
                                                                                                                                                   illness. Cambridge (MA): MIT Press; 2016. vol. 20.
    parameters W     (maini,:)       for each participant, we generated predic-                                                                6.  Xiong H, Chu C, Fan L, Song M, Zhang J, Ma Y, Zheng R,
    tive action and BOLD signal time series in response to sen-                                                                                    Zhang J, Yang Z, Jiang T. The digital twin brain: A bridge
    sory stimuli in the Emotional Faces and Stroop tasks. From the                                                                                 between biological and artificial intelligence. Intell Comput.
    predicted behavioral and neural activity time-series data, we                                                                                  2023;2:0055.
    calculated the postmanipulation affective response and pro                -                                                                7.  Spitzer M, Dattner I, Zilcha-Mano S. Digital twins and
    cessing speed in the model. Intervention effects were evaluated                                                                                the future of precision mental health. Front Psychiatry.
    by comparing these values with the corresponding premanipu-                                                                                    2023;14:1082598.
    lation  values.                                                                                                                            8.  Huys QJM, Browning M, Paulus MP, Frank MJ. Advances
                                                                                                                                                   in the computational understanding of mental illness.
    Acknowledgments                                                                                                                            9.  Neuropsychopharmacology. 2021;46(1):3–19.
                                                                                                                                                   D’Angelo E, Jirsa V. The quest for multiscale brain modeling.
      Funding: This work was supported by the JSPS KAKENHI                                                                                         Trends Neurosci. 2022;45(10):777–790.
    (JP21K15723, JP24K20897, JP20H00625, JP24H00076, JP24-                         10.                                                             Good T, Schirner M, Shen K, Ritter P, Mukherjee P, Levine B,
    K00499, and JP25H01173), JST BOOST (JPMJBY24E5), JST                                                                                           McIntosh AR. Personalized connectome-based modeling
    CREST (JPMJCR21P4), AMED (JP25wm0625419, JP21tm0424601,                                                                                        in patients with semi-acute phase TBI: Relationship to
    and JP24wm0625407), and Intramural Research Grant (4-6,                                                                                        acute neuroimaging and 6 month follow-up. eNeuro.
    6-9, and 7-9) for Neurological and Psychiatric Disorders of                                                                                    2022;9(1):Article ENEURO.0075-21.2022.
    NCNP. The funder played no role in the study design, data col-                 11.                                                             Schirner M, Deco G, Ritter P. Learning how network structure
    lection, analysis, data interpretation, or manuscript writing.                                                                                 shapes decision-making for bio-inspired computing. Nat
      Author contributions: Y.T. and Y.Y. conceived the study. Y.T.                                                                                Commun. 2023;14(1):2963.
    conducted the experiments and analysis. T.S. contributed to                    12.                                                             Parr T, Rees G, Friston KJ. Computational neuropsychology
    model building. H.T. supported the setup of the computational                                                                                  and Bayesian inference. Front Hum Neurosci. 2018;12:61.
    environment. Y.T. prepared the original draft. Y.T., T.S., H.T.,               13.                                                             Takahashi Y, Murata S, Idei H, Tomita H, Yamashita Y. Neural
    and Y.Y. reviewed, edited, and approved the final manuscript.                                                                                  network modeling of altered facial expression recognition in
      Competing interests: The authors declare that they have no                                                                                   autism spectrum disorders based on predictive processing
    competing  interests.                                                                                                                          framework. Sci Rep. 2021;11(1):14684.

    Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                                                                                         15

 14.   Soda T, Ahmadi A, Tani J, Honda M, Hanakawa T,                             distraction in bipolar disorder and unaffected relatives. Transl
       Yamashita Y. Simulating developmental diversity: Impact of                 Psychiatry. 2015;5(1):e497.
       neural stochasticity on atypical flexibility and hierarchy. Front    29.   Yamashita A, Hayasaka S, Kawato M, Imamizu H.
       Psychiatry. 2023;14:1080668.                                               Connectivity neurofeedback training can differentially change
 15.   Insel T, Cuthbert B, Garvey M, Heinssen R, Pine DS, Quinn K,               functional connectivity and cognitive performance. Cereb
       Sanislow C, Wang P. Research Domain Criteria (RDoC):                       Cortex. 2017;27(10):4960–4970.
       Toward a new classification framework for research on mental         30.   Chiba T, Kanazawa T, Koizumi A, Ide K, Taschereau-Dumouchel V,
       disorders. Am J Psychiatry. 2010;167(7):748–751.                           Boku S, Hishimoto A, Shirakawa M, Sora I, Lau H, et al.
 16.   Ahorsu DK, Tsang H. Do people with depression always have                  Current status of neurofeedback for post-traumatic stress
       decreased cognitive processing speed? Evidence through                     disorder: A systematic review and the possibility of decoded
       electrophysiological lens. Neuropsychiatry. 2018;8(4):                     neurofeedback. Front Hum Neurosci. 2019;13:233.
       1227–1231.                                                           31.   Tetereva A, Li J, Deng JD, Stringaris A, Pat N. Capturing brain-
 17.   Medeiros GC, Rush AJ, Jha M, Carmody T, Furman JL,                         cognition relationship: Integrating task-based fMRI across
       Czysz AH, Trombello JM, Cooper CM, Trivedi MH.                             tasks markedly boosts prediction and test-retest reliability.
       Positive and Negative Valence Systems in major depression                  Neuroimage. 2022;263:Article 119588.
       have distinct clinical features, response to antidepressants,        32.   Rosenberg MD, Scheinost D, Greene AS, Avery EW, Kwon YH,
       and relationships with immunomarkers. Depress Anxiety.                     Finn ES, Ramani R, Qiu M, Constable RT, Chun MM.
       2020;37(8):771–783.                                                        Functional connectivity predicts changes in attention observed
 18.   Leichsenring F, Steinert C, Rabung S, Ioannidis JPA. The                   across minutes, days, and months. Proc Natl Acad Sci USA.
       efficacy of psychotherapies and pharmacotherapies for                      2020;117(7):3797–3807.
       mental disorders in adults: An umbrella review and meta-             33.   Lin Q, Rosenberg MD, Yoo K, Hsu TW, O’Connell TP,
       analytic evaluation of recent meta-analyses. World Psychiatry.             Chun MM. Resting-state functional connectivity predicts
       2022;21(1):133–145.                                                        cognitive impairment related to Alzheimer’s disease. Front
 19.   van Bueren NER, Reed TL, Nguyen V, Sheffield JG, van                       Aging Neurosci. 2018;10:94.
       der Ven SHG, Osborne MA, Kroesbergen EH, Kadosh RC.                  34.   Avery EW, Yoo K, Rosenberg MD, Greene AS, Gao S, Na DL,
       Personalized brain stimulation for effective neurointervention             Scheinost D, Constable TR, Chun MM. Distributed patterns of
       across participants. PLOS Comput Biol. 2021;17(9):                         functional connectivity predict working memory performance
       Article e1008886.                                                          in novel healthy and memory-impaired individuals. J Cogn
 20.   Escrichs A, Perl YS, Fisher PM, Martínez-Molina N,                         Neurosci. 2020;32(2):241–255.
       G-Guzman E, Frokjaer VG, Kringelbach ML, Knudsen GM,                 35.   Rosenberg MD, Finn ES, Scheinost D, Papademetris X,
       Deco G. Whole-brain turbulent dynamics predict                             Shen X, Constable RT, Chun MM. A neuromarker of sustained
       responsiveness to pharmacological treatment in major                       attention from whole-brain functional connectivity. Nat
       depressive disorder. Mol Psychiatry. 2025;30(3):1069–1079.                 Neurosci. 2016;19(1):165–171.
 21.   An S, Fousek J, Kiss ZHT, Cortese F, van der Wijk G,                 36.   Gbadeyan O, Teng J, Prakash RS. Predicting response time
       McAusland LB, Ramasubbu R, Jirsa VK, Protzner AB. High-                    variability from task and resting-state functional connectivity
       resolution virtual brain modeling personalizes deep brain                  in the aging brain. Neuroimage. 2022;250:Article 118890.
       stimulation for treatment-resistant depression: Spatiotemporal       37.   Chowdhury MSN, Dutta A, Robison MK, Blais C, Brewer GA,
       response characteristics following stimulation of neural fiber             Bliss DW. Deep neural network for visual stimulus-based
       pathways. Neuroimage. 2022;249:Article 118848.                             reaction time estimation using the periodogram of single-trial
 22.   Cao Z, Xiao X, Xie C, Wei L, Yang Y, Zhu C. Personalized                   EEG. Sensors. 2020;20(21):6090.
       connectivity-based network targeting model of transcranial           38.   He T, Kong R, Holmes AJ, Nguyen M, Sabuncu MR,
       magnetic stimulation for treatment of psychiatric disorders:               Eickhoff SB, Bzdok D, Feng J, Yeo BTT. Deep neural networks
       Computational feasibility and reproducibility. Front Psychiatry.           and kernel regression achieve comparable accuracies
       2024;15:1341908.                                                           for functional connectivity prediction of behavior and
 23.   Ha D, Dai A, Le QV. HyperNetworks. arXiv:1609.09106. 2016.                 demographics. Neuroimage. 2020;206:Article 116276.
       https://doi.org/10.48550/arXiv.1609.09106                            39.   Dubois J, Galdi P, Paul LK, Adolphs R. A distributed brain
 24.   Dezfouli A, Nock R, Dayan P. Neural network based models                   network predicts general intelligence from resting-state
       of individual differences in decision-making. Adv Neural Inf               human neuroimaging data. Philos Trans R Soc Lond B Biol Sci.
       Process Syst. 2019;32:2254–2263.                                           2018;373(1756):Article 20170284.
 25.   Hariri AR, Tessitore A, Mattay VS, Fera F, Weinberger DR.            40.   Jayakumar SM, Czarnecki WM, Menick J, Schwarz J, Rae J,
       The amygdala response to emotional stimuli: A comparison of                Osidnero S, Teh YW, Harley T, Pascanu R. Multiplicative
       faces and scenes. Neuroimage. 2002;17(1):317–323.                          interactions and where to find them. Paper presented at
 26.   Phan KL, Fitzgerald DA, Nathan PJ, Tancer ME. Association                  International Conference on Learning Representations (ICLR);
       between amygdala hyperactivity to harsh faces and severity                 2020 April 26û30; Addis Ababa, Ethiopia (Virtual).
       of social anxiety in generalized social phobia. Biol Psychiatry.     41.   Wu Y, Zhang S, Zhang Y, Bengio Y, Salakhutdinov RR. On
       2006;59(5):424–429.                                                        multiplicative integration with recurrent neural networks. Adv
 27.   Kleinhans NM, Johnson LC, Richards T, Mahurin R,                           Neural Inf Process Syst. 2016;29:2864–2872.
       Greenson J, Dawson G, Aylward E. Reduced neural habituation          42.   Ji-An L, Benna MK, Mattar MG. Discovering cognitive strategies
       in the amygdala and social impairments in autism spectrum                  with tiny recurrent neural networks. Nature. 2025;644:993–1001.
       disorders. Am J Psychiatry. 2009;166(4):467–475.                     43.   Bertinetto L, Henriques JF, Valmadre J, Torr P, Vedaldi A.
 28.   Kanske P, Schönfelder S, Forneck J, Wessa M. Impaired                      Learning feed-forward one-shot learners. Adv Neural Inf
       regulation of emotion: Neural correlates of reappraisal and                Process Syst. 2016;29:523–531.

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                            16

 44.   Arundell L-LC, Saunders R, Buckman JEJ, Lewis G, Stott J,                 Pimentel-Silva LR, Avansini SH, et al. Between neurons
       Singh S, Jena R, Naqvi SA, Leibowitz J, Pilling S. Differences            and networks: Investigating mesoscale brain connectivity
       in psychological treatment outcomes by ethnicity and gender:              in neurological and psychiatric disorders. Front Neurosci.
       An analysis of individual patient data. Soc Psychiatry Psychiatr          2024;18:1340345.
       Epidemiol. 2024;59(9):1519–1531.                                    61.   Takahashi Y, Takeuchi H, Sakai M, Yu Z, Kikuchi Y, Ito F,
 45.   Takahashi Y, Yoshizoe K, Ueki M, Tamiya G, Zhiqian Y,                     Matsuoka H, Tanabe O, Yasuda J, Taki Y, et al. A single
       Utsumi Y, Sakuma A, Tsuda K, Hozawa A, Tsuji I, et al.                    nucleotide polymorphism (−250 A/C) of the GFAP gene
       Machine learning to reveal hidden risk combinations for the               is associated with brain structures and cerebral blood flow.
       trajectory of posttraumatic stress disorder symptoms. Sci Rep.            Psychiatry Clin Neurosci. 2020;74(1):49–55.
       2020;10(1):21726.                                                   62.   Sakai M, Takeuchi H, Yu Z, Kikuchi Y, Ono C, Takahashi Y,
 46.   Idei H, Yamashita Y. Elucidating multifinal and equifinal                 Ito F, Matsuoka H, Tanabe O, Yasuda J. Polymorphisms in the
       pathways to developmental disorders by constructing real-                 microglial marker molecule CX3CR1 affect the blood volume
       world neurorobotic models. Neural Netw. 2024;169:57–74.                   of the human brain. Psychiatry Clin Neurosci. 2018;72(6):
 47.   Takahashi Y, Murata S, Ueki M, Tomita H, Yamashita Y.                     409–422.
       Interaction between functional connectivity and neural              63.   Chopra S, Cocuzza CV, Lawhead C, Ricard JA, Labache L,
       excitability in autism: A novel framework for computational               Patrick LM, Kumar P, Rubenstein A, Moses J, Chen L. et al.,
       modeling and application to biological data. Comput                       The transdiagnostic connectome project: A richly phenotyped
       Psychiatry. 2023;7(1):14–29.                                              open dataset for advancing the study of brain-behavior
 48.   Sun W, Billot A, Du J, Wei X, Lemley RA, Daneshzand M,                    relationships in psychiatry. medRxiv. 2024. https://doi.
       Nummenmaa A, Buckner RL, Eldaief MC. Precision                            org/10.1101/2024.06.18.24309054
       network modeling of transcranial magnetic stimulation               64.   Tottenham N, Tanaka JW, Leon AC, Carry TM, Nurse M,
       across individuals suggests therapeutic targets and                       Hare TA, Marcus DJ, Westerlund A, Casey BJ, Nelson C. The
       potential for improvement. medRxiv. 2024. https://doi.                    NimStim set of facial expressions: Judgments from untrained
       org/10.1101/2024.08.15.24311994                                           research participants. Psychiatry Res. 2009;168(3):242–249.
 49.   Pessoa L. A network model of the emotional brain. Trends            65.   Stroop JR. Studies of interference in serial verbal reactions.
       Cogn Sci. 2017;21(5):357–371.                                             J Exp Psychol. 1935;18(6):643–662.
 50.   Pessoa L, Adolphs R. Emotion processing and the amygdala:           66.   Scarpina F, Tagini S. The Stroop color and word test. Front
       From a ‘low road’ to ‘many roads’ of evaluating biological                Psychol. 2017;8:557.
       significance. Nat Rev Neurosci. 2010;11(11):773–783.                67.   Periáñez JA, Lubrini G, García-Gutiérrez A, Ríos-Lago M.
 51.   Kober H, Barrett LF, Joseph J, Bliss-Moreau E, Lindquist K,               Construct validity of the Stroop color-word test: Influence
       Wager TD. Functional grouping and cortical-subcortical                    of speed of visual search, verbal fluency, working memory,
       interactions in emotion: A meta-analysis of neuroimaging                  cognitive flexibility, and conflict monitoring. Arch Clin
       studies. Neuroimage. 2008;42(2):998–1031.                                 Neuropsychol. 2021;36(1):99–111.
 52.   Malezieux M, Klein AS, Gogolla N. Neural circuits for               68.   Glasser MF, Sotiropoulos SN, Wilson JA, Coalson TS, Fischl B,
       emotion. Annu Rev Neurosci. 2023;46:211–231.                              Andersson JL, Xu J, Jbabdi S, Webster M, Polimeni JR, et al.
 53.   Fan J, McCandliss BD, Fossella J, Flombaum JI, Posner MI.                 The minimal preprocessing pipelines for the Human
       The activation of attentional networks. Neuroimage.                       Connectome Project. Neuroimage. 2013;80:105–124.
       2005;26(2):471–479.                                                 69.   Fischl B. FreeSurfer. Neuroimage. 2012;62(2):774–781.
 54.   MacDonald AW III, Cohen JD, Stenger VA, Carter CS.                  70.   Glasser MF, Coalson TS, Robinson EC, Hacker CD, Harwell J,
       Dissociating the role of the dorsolateral prefrontal and                  Yacoub E, Ugurbil K, Andersson J, Beckmann CF,
       anterior cingulate cortex in cognitive control. Science.                  Jenkinson M, et al. A multi-modal parcellation of human
       2000;288(5472):1835–1838.                                                 cerebral cortex. Nature. 2016;536(7615):171–178.
 55.   Eagle DM, Baunez C, Hutcheson DM, Lehmann O, Shah AP,               71.   Griffanti L, Salimi-Khorshidi G, Beckmann CF, Auerbach EJ,
       Robbins TW. Stop-signal reaction-time task performance: Role              Douaud G, Sexton CE, Zsoldos E, Ebmeier KP, Filippini N,
       of prefrontal cortex and subthalamic nucleus. Cereb Cortex.               Mackay CE, et al. ICA-based artefact removal and accelerated
       2008;18(1):178–188.                                                       fMRI acquisition for improved resting state network imaging.
 56.   Yarkoni T, Barch DM, Gray JR, Conturo TE, Braver TS. BOLD                 Neuroimage. 2014;95:232–247.
       correlates of trial-by-trial reaction time variability in gray      72.   Schaefer A, Kong R, Gordon EM, Laumann TO, Zuo X-N,
       and white matter: A multi-study fMRI analysis. PLOS ONE.                  Holmes AJ, Eickhoff SB, Yeo BTT. Local-global parcellation
       2009;4(1):Article e4257.                                                  of the human cerebral cortex from intrinsic functional
 57.   Fox MD. Mapping symptoms to brain networks with the                       connectivity MRI. Cereb Cortex. 2017;28(9):3095–3114.
       human connectome. N Engl J Med. 2018;379(23):2237–2245.             73.   Tian Y, Margulies DS, Breakspear M, Zalesky A.
 58.   Joutsa J, Corp DT, Fox MD. Lesion network mapping for                     Topographic organization of the human subcortex unveiled
       symptom localization: Recent developments and future                      with functional connectivity gradients. Nat Neurosci.
       directions. Curr Opin Neurol. 2022;35(4):453–459.                         2020;23(11):1421–1432.
 59.   Dadi K, Rahim M, Abraham A, Chyzhyk D, Milham M,                    74.   Buckner RL, Krienen FM, Castellanos A, Diaz JC, Yeo BTT.
       Thirion B, Varoquaux G, Alzheimer’s Disease Neuroimaging                  The organization of the human cerebellum estimated
       Initiative. Benchmarking functional connectome-based                      by intrinsic functional connectivity. J Neurophysiol.
       predictive models for resting-state fMRI. Neuroimage.                     2011;106(5):2322–2345.
       2019;192:115–134.                                                   75.   Mante V, Sussillo D, Shenoy KV, Newsome WT. Context-
 60.   Caznok Silveira AC, Antunes ASLM, Athié MCP, da Silva BF,                 dependent computation by recurrent dynamics in prefrontal
       Dos Santos JVR, Canateli C, Fontoura MA, Pinto A,                         cortex. Nature. 2013;503(7474):78–84.

Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                           17

 76.   Yang GR, Joglekar MR, Song HF, Newsome WT, Wang X-J.             78.   Sheppard LD, Vernon PA. Intelligence and speed of
       Task representations in neural networks trained to perform             information-processing: A review of 50 years of research. Pers
       many cognitive tasks. Nat Neurosci. 2019;22(2):297–306.                Individ Dif. 2008;44(3):535–551.
 77.   Palomero-Gallagher N, Amunts K. A short review on emotion        79.   SmilkovD, Thorat N, Kim B, Viégas F, Wattenberg M.
       processing: A lateralized network of neuronal networks. Brain          Smoothgrad: Removing noise by adding noise. arXiv:1706.03825.
       Struct Funct. 2022;227(2):673–684.                                     2017. https://doi.org/10.48550/arXiv.1706.03825










Takahashi et al. 2026 | https://doi.org/10.34133/bmef.0231                    18
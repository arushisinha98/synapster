                                 Articles
https://doi.org/10.1038/s41593-018-0310-2



Task representations in neural networks trained to
perform many cognitive tasks

Guangyu Robert Yang 1,2, Madhura R. Joglekar1,6, H. Francis Song1,7, William T. Newsome3,4
and Xiao-Jing Wang 1,5*

The brain has the ability to flexibly perform many tasks, but the underlying mechanism cannot be elucidated in traditional
experimental and modeling studies designed for one task at a time. Here, we trained single network models to perform 20
cognitive tasks that depend on working memory, decision making, categorization, and inhibitory control. We found that after
training, recurrent units can develop into clusters that are functionally specialized for different cognitive processes, and we
introduce a simple yet effective measure to quantify relationships between single-unit neural representations of tasks. Learning
often gives rise to compositionality of task representations, a critical feature for cognitive flexibility, whereby one task can be
performed by recombining instructions for other tasks. Finally, networks developed mixed task selectivity similar to recorded
prefrontal neurons after learning multiple tasks sequentially with a continual-learning technique. This work provides a compu-
tational platform to investigate neural representations of many cognitive tasks.

The prefrontal cortex is important for numerous cognitive For a network capable of performing many tasks, should it be
      functions1–3, partly because of its central role in task repre- clustered? Should its representation be compositional? Conceptually,
      sentation4–7. Electrophysiological experiments using behav- the answer to either question can be yes or no, independently
ing animals have found prefrontal neurons that are either selective (Fig. 1a). A randomly connected network can potentially solve
for different aspects of a given task8,9 or functionally mixed10,11. multiple tasks by mixing sensory stimuli and rule inputs in a high-
Much less is known about functional specialization of task repre- dimensional space. Such a network will have no clustering and show
sentations at the neuronal level. Imagine a single-neuron record- no compositionality across tasks. A network where different tasks
ing that could be carried out with animals switching between are represented by completely non-overlapping populations will
many different tasks. Is each task supported by a ‘private’ cluster show clustering but no compositionality. A network can be both
of neurons, does each task involve every neuron in the network, or clustered and compositional if common cognitive processes across
somewhere in between? If two tasks require a common underlying tasks are represented by distinct clusters of neurons. Finally, imag-
cognitive process, such as working memory or decision-making ine linearly mixing neuronal activity of a clustered, compositional
(DM), what would be the relationship between their neural rep- network. The resulting neural activity would still be compositional,
resentations? In other words, what would be the ‘neural relation- but no longer clustered at the single-unit level.
ship’ between this pair of tasks? Would the two tasks use a shared Verifying these hypotheses remains difficult with conventional
cluster of neurons? experimental and modeling approaches. Experiments with labora-
   Humans readily learn to perform many cognitive tasks in a short tory animals have so far been largely limited to a single task at a
time. By following verbal instructions such as ‘release the lever only time; on the other hand, human imaging studies lack the spatial res-
if the second item is not the same as the first’, humans can perform olution to address questions at the single-neuron level. Therefore,
a novel task without any training at all⁶. A cognitive task is typically the lack of neural recordings from animals performing many dif-
composed of elementary sensory, cognitive, and motor processes⁵. ferent tasks leaves unanswered important questions regarding how
At the computational level, correctly performing a new task without a single network represents and supports distinct tasks. In principle,
training requires composing elementary processes that are already these questions could be addressed in neural circuit models, but
learned. This property, called ‘compositionality’, has been proposed designing a single neural circuit model capable of multiple tasks is
as a fundamental principle underlying flexible cognitive control¹². challenging and virtually nonexistent.
In a neuronal circuit equipped with a compositional code, a new To explore potential solutions to these problems, we took the
task might be represented as the algebraic sum of representations of approach of training RNNs11,14–19. In this work, we trained single
the underlying elementary processes. Indeed, human studies have RNNs to perform 20 cognitive tasks. We found that after training
suggested that the representation of complex cognitive tasks in the all tasks simultaneously, the emerging task representations were
lateral prefrontal cortex could be compositional6,13. However, these organized in the form of clustering of recurrent units. Through a
tasks involved verbal instructions; it is unknown whether non-ver- systematic examination, we identified the conditions under which
bal tasks commonly used in animal physiological experiments also clusters emerge. We found that a simple form of compositional task
display compositionality and whether compositional task structures representation emerges from training in our network models. These
can emerge in relatively simple neural network models. networks can be instructed to perform certain tasks by combining


1Center for Neural Science, New York University, New York, NY, USA. 2Mortimer B. Zuckerman Mind Brain Behavior Institute, Department of Neuroscience,
Columbia University, New York, NY, USA. ³Department of Neurobiology, Stanford University, Stanford, CA, USA. ⁴Howard Hughes Medical Institute,
Stanford University, Stanford, CA, USA. ⁵Shanghai Research Center for Brain Science and Brain-Inspired Intelligence, Shanghai, China. ⁶Present address:
Courant Institute of Mathematical Sciences, New York University, New York, NY, USA. ⁷Present address: DeepMind, London, UK. *e-mail: xjwang@nyu.edu

NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience 297

    Articles                                                    NaTure NeuroscieNce

     a                                                          b
          Potential mechanisms
              for multiple tasks    High                                      Fixation input          256  Recurrent units
          Task 1  Task 2                    Clustering                  360°  Stimulus mod 1
                                                                          0°  Stimulus mod 2            1
              Low                                   High                                                   Fixation output
                                                Compositionality          20   Rule inputs           360°      Response
                                                                                                                         -

                                                                           1  0 Time (ms)1,000         0°

                                    Low
     c 1                                — Go        Task        d      DM 1      e                         MultSen DM     °
                                            RT Go       — MultSen DM              1.0 o Stimulus time (ms)  Modality
                                                        — Dly DM 1                             200         1 only

                                        —   Anti        —   Ctx Dly DM 1                       800          Both     ©
                                            RT Anti     —   Ctx Dly DM 2           0.5
                                            Dly Anti    —
                                            DM 2            DMS
          0                                 DM 1        — MultSen Dly DM             4                              °
                                                            DNMS
              0  1,000 2,000     3,000      Ctx DM 1        DMC                    0.0
              Total trials (1,000)          Ctx DM 2    — DNMC      –0.05           0.00     0.05 –0.05             0.00  0.05
                                                                            Stim1 – Stim2 (a.u.)      Stim1 – Stim2 (a.u.)

    Fig. 1 | a recurrent neural network model is trained to perform a large number of cognitive tasks. a, Schematic showing how the same network can
    potentially solve two tasks with or without clustering and compositionality. b, An example of a fully connected recurrent neural network (RNN) (middle,
    1% of connections shown) described by rate units receives inputs (left) encoding a fixation cue, stimuli from two modalities, and a rule signal (that
    instructs the system which task to perform in a given trial). The network has 256 recurrent units (top right) and it projects to a fixation output unit (which
    should be active when a motor response is unwarranted) and a population of units selective for response directions (right). All units in the reference
    recurrent network have non-negative firing rates. All connection weights and biases are modifiable by training using a supervised learning protocol.
    c, The network successfully learned to perform 20 tasks. d,e, Psychometric curves in two DM tasks. d, Perceptual DM relies on temporal integration
    of information, as the network performance improves when the noisy stimulus is presented for a longer time. a.u., arbitrary unit. e, In a multi-sensory
    integration task, the trained network combines information from two modalities to improve performance (compared with performance when information
    is only provided by a single modality). Ctx, context dependent; Dly, delayed; DMC, delayed match-to-category; DMS, delayed match-to-sample; DNMC,
    delayed non-match-to-category; DNMS, delayed non-match-to-sample.



instructions for other tasks. To mimic the process of adult animals provides a ‘go signal’ to the network. The stimulus inputs consist
learning laboratory tasks, we also trained networks to learn mul- of two modalities, each represented by a ring of input units that
tiple tasks sequentially with the help of a continual-learning tech- encodes a one-dimensional circular variable such as motion direc-
nique. The resulting neural representation in such networks can tion or color on a color wheel¹⁸. A single rule input unit is activated
be markedly different from networks trained on all tasks simulta- in each trial, instructing the network on which task it is currently
neously. Neural recordings from the prefrontal cortex of monkeys supposed to perform. The network projects to a fixation output unit
performing context-dependent DM tasks are consistent with the and a group of motor units encoding the response direction as a
continual-learning networks. Our work provides a framework for one-dimensional variable on a ring of outputs (for example, saccade
investigating neural representations of task structures. direction, reach direction). All network units receive private noise.
        In the ‘reference’ setting of our networks, all units have non-nega-
Results tive and non-saturating activities to mimic biological neurons28,29.
Training neural networks for many cognitive tasks. To study Before training, a network is incapable of performing any task.
how various cognitive tasks might be implemented in a single neu- It is trained with supervised learning11,15, which modifies all con-
ral circuit, we first trained a RNN model (Fig. 1b) to perform 20 nection weights (input, recurrent and output) to minimize the dif-
inter-related tasks. Most of these tasks are commonly used in neu- ference between the network output and a desired (target) output.
rophysiological studies of non-human animals and crucial to our Notably, for the networks analyzed throughout most of the paper,
understanding of the neural mechanisms of cognition. The cho- all tasks were randomly interleaved during training. At the end,
sen set of tasks includes variants of memory-guided response²⁰, we will present results from sequential training of tasks. Below we
simple perceptual DM²¹, context-dependent DM11,22, multi-sensory show results obtained from networks of 256 recurrent units, and
integration²³, parametric working memory²⁴, inhibitory control our results were robust with respect to the exact network size. After
(for example, in anti-saccade)²⁵, delayed match-to-sample²⁶, and training, single network models achieved high behavioral per-
delayed match-to-category27 tasks (Supplementary Table 1 and formance across all tasks (Fig. 1c). Furthermore, by conducting a
Supplementary Fig. 1). battery of psychometric tests, we demonstrated that the networks
   We designed our network architecture to be general enough for display behavioral features consistent with animal studies. In per-
all the tasks mentioned above, but otherwise as simple as possible to ceptual DM tasks, an example network achieved better perfor-
facilitate analysis. For every task, the network receives noisy inputs mance with higher coherence and longer duration of the stimulus²¹
of three types: fixation, stimulus, and rule (Fig. 1b). The fixation (Fig. 1d and Supplementary Fig. 2a–f), and it combined informa-
input indicates whether the network should ‘fixate’ or respond tion from different sources to form decisions23 (Fig. 1e). In working
(for example, ‘saccade’). Thus, the decrease in the fixation input memory tasks, the same network was able to maintain information

298 NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience










Performance










P(choice 1)

    NaTure NeuroscieNce                                                                                                                                      Articles
                      a                              c           Go                          Units                              1
                        1.0        Unit 145 Go                RT Go             mm
                                                               Anti
                        0.5             [>                   Dly Go
                                                            RT Anti              |         |
                        0.0                                Dly Anti                                         I
                                                               DM 1
                               0.0  Time (s)    1.5            DM 2                        =
                                                           Ctx DM 1                                   1
                                                           Ctx DM 2
                      b                                  MultSen DM                                   m
                                    Unit 145               Dly DM 1
                                                           Dly DM 2
                       0.05                            Ctx Dly DM 1                 |                  [       |    |
                                                       Ctx Dly DM 2                      |
                                                     MultSen Dly DM                                               |
                                                                DMS        J        |
                       0.00                                    DNMS    ll                |                     I         |_|]
                                                                DMC        |                                        |        |
                                        Task                   DNMC                                                             0
                                                                       1        2     3  4      5   6  7    8     9    10 11 12
                                                                                                 Clusters
                      d                 tSNE                                     e             Go                               0.5
                                                                                            RT Go    Mm
                                                                                           Dly Go
                                 °®                                                          Anti
                                            °®           an                               RT Anti
                                                                                         Dly Anti
                                                     4                                       DM 1
                                                                                             DM 2
                      o                                                                  Ctx DM 1
                                   °                                                     Ctx DM 2
                          LY°               3                                          MultSen DM
                                                                                         Dly DM 1
                                                                                         Dly DM 2
                                                                                     Ctx Dly DM 1
                                                                                     Ctx Dly DM 2
                               2   >                                               MultSen Dly DM
                                                                                             DNMS
                                 We                                                           DMS    |
                                                                                              DMC           []          "1
                                                                                             DNMC                               –0.5
                                                                                             1       2 3  4 5  6  7 8 9 10 11 12
                                                                                                            Clusters

    Fig. 2 | The emergence of functionally specialized clusters for task representation. a, Neural activity of a single unit during an example task. Different
    traces correspond to different stimulus conditions. b, Task variances across all tasks for the same unit. For each unit, task variance measures the variance
    of activities across all stimulus conditions. c, Task variances across all tasks and active units, normalized by the peak value across tasks for each unit. Units
    form distinct clusters identified using the k-means clustering method based on normalized task variances. Each cluster is specialized for a subset of tasks.
    A task can involve units from several clusters. Units are sorted by their cluster membership, indicated by colored lines at the bottom. d, Visualization of the
    task variance map. For each unit, task variances across tasks form a vector that is embedded in the two-dimensional space using t-distributed stochastic
    neighbor embedding (tSNE). Units are colored according to their cluster membership. e, Change in performance across all tasks when each cluster of
    units is lesioned.

    throughout a delay period of up to 5 s1,20,24 (50 times the single-unit                       stimulus information is encoded. Units with different stimulus tun-
    time constant) (Supplementary Fig. 2g).                                                    ing can have the same task variance in a task. Task variance is agnos-
                                                                                                 tic about the task setup and can be easily computed in models and is
    Functional clusters encode subsets of tasks in reference networks.                   also applicable to the analysis of experimental data.
    The focus of our analysis was to examine the neural representation                             By computing the task variance for all trained tasks, we were able
    of tasks. After training, it is conceivable that each unit of the recur-                 to study how individual units are differentially selective in all of the
    rent network is only selective in one or a few tasks, forming highly                       tasks (Fig. 2b). For better comparison across units, we normalized the
    specialized task representations. On the other hand, task represen-                             task variance of each unit such that the maximum normalized vari-
    tations may be completely mixed, where all units are engaged in                           ance over all tasks was 1. By analyzing the patterns of normalized task
    every task (Fig. 1a). We sought to assess where our reference net-                         variance for all active units, we found that units were self-organized
    works lie on the continuum between these two extreme scenarios.                              into distinct clusters through learning (Fig. 2c,d and Supplementary
    In this section, we will focus our analyses on one example network.                           Fig. 3a) (see Methods). We identified about 15 clusters in the net-
                 To quantify single-unit task representation, we need a measure of                work. The ideal number of clusters was chosen to maximize the ratio
    task selectivity that is general enough that it applies to a broad range                  of intercluster to intracluster distances (Supplementary Fig. 4). Units
    of tasks, and at the same time simple enough that it can be easily                          belonging to the same cluster are mainly selective in the same subset
    computed. We propose a measure that we call task variance (see                                of tasks. Units in the same cluster can have different incoming and
    Methods). For each task and each unit, the task variance computes                            outgoing connection weights however, simply as a result of different
    the variance of that unit’s noise-free response across conditions in                 stimulus tuning (Supplementary Fig. 5).
    that task (Fig. 2a). This measure quantifies the amount of stimulus                             To understand the causal role of these clusters, we lesioned each
    information a unit conveyed during a task, without asking how that                                  of them while monitoring the change in performance across all

    NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience                                                                    299










                                    Task variance    Activitity (a.u.)


                                    Go





                               DNMC










Performance change after lesioning      Normalized task variance

    Articles                                                                                                        NaTure NeuroscieNce

    a                                                                    c             Activation function     d  Network type      e    Initialization
    Activation      Network            Initialization | L1 weight        L1 rate         Softplus                    RNN
     function               type                     regularization | regularization                                                  ]                  Diag.
     Softplus  m                                           0                0            ReLU
       ReLU    m            RNN     =   Diagonal ®    | 1 × 10–5         1 × 10–5           a
       Tanh    ®            GRU     =   Random     | 1 × 10–4            1 × 10–4   L    Retanh                    | GRU              |                  Rand.
      Retanh   =                       orthogonal       1 × 10–3         1 × 10–3   1    Tanh                      |                                     Ortho.
    b                                                                    0                  15            30   0       15     30    0    15                  30
                  30                        |                            f          Number of clusters          Number of clusters    Number of clusters
                  20                                                                    L1 weight              g    L1 rate
                  10                              0 No. of clusters 30   |               0                     fi      0
                   0                                                                    1 × 10–5                   1 × 10–5

     Activation function                                                            |   1 × 10–4                |  1 × 10–4
            Network type                                                                                            Be,
          Initialization
                 L1 rate                                                            1   1 × 10–3                1  1 × 10–3
               L1 weight    1           Networks                   205   0                  15            30   0       15     30
                                                                                    Number of clusters          Number of clusters

    Fig. 3 | The activation function dictates whether clusters emerge in a network. a, A total of 256 networks were trained, each with a different set of
    hyperparameters. b, Top, the networks are sorted by their numbers of clusters. Bottom, the hyperparameters used for each network are indicated by
    colors, as defined in a. Inset, the distribution of cluster numbers across networks. Only networks that reached the minimum performance of 90% for every
    task are shown. c–g, Breaking down the number of clusters according to the activation function (c), network architecture (d), weight initialization (e), L1
    weight regularization strength (f), and L1 rate regularization strength (g). In e–g, all networks as in a that learned all tasks are included. In d, only networks
    with Softplus and ReLU activation functions are shown, as no RNN with Tanh and ReTanh successfully learned all tasks.


    20 tasks (Fig. 2e). We found one cluster (cluster number 3) that was     on activity (see Methods). We tested all combinations of these dif-
    specialized for the Anti-family tasks. Another two clusters (cluster     ferent hyperparameters, for a total of 256 networks (Fig. 3a).
    numbers 5 and 6) were specialized for DM tasks involving modality               We found that the number of clusters differed widely across net-
    1 and 2, respectively. Furthermore, one cluster (cluster number 8)       works that successfully learned all 20 tasks, ranging from the lowest
    selective in the parametric working memory tasks (the delayed DM         (2) to the highest number (30) allowed by the clustering algorithm
    or Dly DM task family) was also selective in the perceptual DM           used (Fig. 3b). Surprisingly, the most prominent factor determining
    tasks (the DM task family), indicating a common neural substrate         the number of clusters was the neuronal activation function used
    for these two cognitive functions in our reference networks³⁰. We        (Fig. 3c). Most networks (>80%) with Softplus and ReLU activa-
    can also study how units are clustered on the basis of epoch vari-       tion functions gave rise to more than five clusters. In contrast, about
    ance, a measure that quantifies how selective units are in each task     80% of the networks with ReTanh and Tanh activation functions
    epoch (Supplementary Fig. 3). One cluster of units presumably sup-       resulted in the minimum number of clusters. The network archi-
    ports response generation, as it was highly selective in the response    tecture, initialization and L1 weight and rate regularizations did
    epoch, but not the stimulus epoch. These findings are robust across      not affect the number of clusters as substantially (Fig. 3d–g). These
    independently trained network with the same setting. Our results         findings show that neural networks trained for many tasks do not
    indicate that the reference networks successfully identified common      necessarily develop clusters of units, but tend to do so when realistic
    sensory, cognitive, and motor processes underlying subsets of tasks,     non-saturating activation functions28,29 are used. The reason for this
    and, through training, developed units dedicated to the shared pro-      discrepancy remains to be elucidated.
    cesses rather than to the individual tasks.
                                                                             Relationships between neural representations of pairs of tasks.
    Assessing clustering across a wide range of models. We showed            In the following sections, we will focus our analyses on the refer-
    that networks trained to perform many cognitive tasks can develop        ence networks. The map of normalized task variance in Fig. 2c
    clusters of units. Although connection weights in the network are        allowed us to visualize the whole network across many tasks all at
    adjusted with supervised learning, we specified the hyperparam-          once. However, it is of limited use when we try to compare with
    eters, such as the neuronal activation function (the input-output        experimental data or to analyze the (dis)similarity of the neural task
    transfer function), the overall network architecture, and further        representation between any pair of tasks. To quantify how each unit
    training objectives. To understand how the emergence of cluster-         is selective in one task in comparison to another task, we introduce
    ing may depend on the hyperparameters used, we trained networks          a simple measure based on task variance: the fractional task vari-
    with four different activation functions (Softplus, rectified linear     ance (FTV). For unit i, the FTV with respect to task A and task B is
    unit or rectified linear function (ReLU), hyperbolic tan function        defined as
    (Tanh), and rectified Tanh or ReTanh), two different architectures
    (leaky RNN and leaky gated recurrent unit (GRU) network), two                                                   TV(A) −TV( )B
    weight initializations (diagonal and random orthogonal), four levels     FTV(A B,                           ) = i     i
    of L1 regularization on weights, and four levels of L1 regularization       i                                   TV(Ai ) + TV( )i B

    300                                                   NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience










No. of clusters

    NaTure NeuroscieNce    Articles

    a    b        c        d    e


                Disjoint                      Inclusive              Mixed                   Disjoint-equal                Disjoint-mixed
                Example network
     0.2          All networks    0.10                   0.10                         0.2
     0.1                          0.05                   0.05                         0.1                         0.05

     0.0                          0.00                   0.00                         0.0                         0.00
            –1         0     1            –1       0      1      –1  0             1         –1 0 1                    –1    0           1
                FTV(DM 1, Anti)           FTV(Dly DM 1, DM 1)    FTV(DM 1, Ctx DM 1)         FTV(Ctx DM 1, Ctx DM 2)   FTV(DMC, DNMC)

    f           Example network   g           h                  GRU + tanh           i          j
    0.10        All networks       0.1                    0.2                         0.4                          0.2
    0.05                                                  0.1                         0.2                          0.1

    0.00                           0.0                    0.0                         0.0                          0.0
            –1         0     1            –1       0      1      –1  0             1         –1    0 1                 –1    0           1
                FTV(DM 1, Anti)           FTV(Dly DM 1, DM 1)    FTV(DM 1, Ctx DM 1)         FTV(Ctx DM 1, Ctx DM 2)   FTV(DMC, DNMC)

    Fig. 4 | a diversity of neural relationships between pairs of tasks. For a pair of tasks, we characterized their neural relationship by the distribution of FTV
    over all units. a–e, In networks with the Softplus activation function, we observed five typical relationships: disjoint (a), inclusive (b), mixed (c), disjoint-
    equal (d), and disjoint-mixed (e). Blue: distribution for one example network. Black: averaged distribution over 20 networks. f–j, In networks with the Tanh
    activation function and the leaky GRU architecture (blue shaded background), the FTV distributions were largely mixed or equal for the same pairs of
    tasks. The pairs of tasks analyzed were DM1 and Anti (a,f), Dly DM 1 and DM 1 (b,g), DM 1 and Ctx DM 1 (c,h), Ctx DM 1 and Ctx DM 2 (d,i), or DMC and
    DNMC (e,j). Results from networks with the leaky RNN architecture and Tanh activation function are not shown because none of them learned all tasks.


where TV (A) and TV (B) are the task variances for tasks A and B, participated in one of the two tasks, whereas the rest of the units
        i i − 1 and + 1. Having a FTV (A,B) were mixed in both tasks.
respectively. FTV ranges between i Consistent with the findings above (Fig. 3), networks with the
close to + 1 (or − 1) means that unit i is primarily selective in task
A (or B). Tanh activation function showed very different FTV distributions.
   For every pair of tasks, we were able to compute the FTV for all In such networks, the FTV distribution for a pair of tasks typically
units that were active in at least one of the two tasks. Each distri- involved a single narrow peak, indicating that units were involved
bution of FTVs contained rich information about the single-unit with similar strengths in both tasks (Fig. 4f–j).
level neural relationship between the pair of tasks. Having 20 tasks In summary, we introduced a simple yet informative measure
provided us with 190 distinct FTV distributions (Supplementary to study the potentially diverse neural relationships between pairs
Fig. 6), from the shape of which we informally summarized five of tasks. We found that, in the reference networks, these relation-
typical neural relationships (Fig. 4). ships could be categorized into several typical classes. FTV dis-
   1. Disjoint (Fig. 4a). When two tasks have a disjoint relationship tributions could be easily computed using neural data, facilitating
such as the Anti task and the DM1 task, the FTV distribution was comparisons with experiments on pairwise neural relationships
characterized by two peaks at the two ends and few units in between. between tasks.
There was little overlap between units selective in the two tasks. The
shape of the FTV distribution was rather robust across indepen- Dissecting the circuit for the context-dependent DM tasks.
dently trained networks: the FTV distribution from one sample net- Here we ‘open the black box’31 and demonstrate how an example
work closely matches the averaged distribution from 20 networks. network could be dissected and analyzed based on its clusters in
   2. Inclusive (Fig. 4b). This relationship was embodied by a two sample cognitive tasks. Context-dependent DM tasks11 require
strongly skewed FTV distribution, suggesting that one task is neu- selective processing, integration and memory of sensory inputs.
rally a subset of another task. In this case, there were no units that Our set of tasks includes two such tasks, Ctx DM 1 and Ctx DM 2
were selective in the DM1 task but not in the Dly DM 1 task. (Supplementary Table 1). Three subgroups of units emerged in the
   3. Mixed (Fig. 4c). A mixed relationship was characterized by network (Fig. 5a). Group 1 (2) units were primarily engaged in con-
a broad unimodal FTV distribution centered around zero with no text 1 (2), whereas group 12 (one-two) units were engaged equally
clear peak at the two ends. This distribution suggests that the two in both contexts. Inactivating or ‘lesioning’ all group 1 (2) units at
tasks use overlapping neural circuits. once resulted in a failure in performing the Ctx DM 1 (2) tasks,
   4. Disjoint-equal (Fig. 4d). For Ctx DM 1 and 2, the FTV distri- respectively (Fig. 5b and Supplementary Fig. 7). In contrast, lesion-
bution was trimodal, with two peaks at the two ends and another ing group 12 units impaired performance across all DM tasks. These
peak around zero. This relationship can be considered to be a com- results suggest that, in this network, groups 1 and 2 are responsible
bination of the disjoint relationship and the equal relationship. The for selective processing of sensory inputs, whereas group 12 is criti-
equal relationship is represented by a single, narrow peak around cal for DM.
zero. In this scenario, the two tasks each get a private neural popula- We next studied the connection weights of groups 1, 2, and 12
tion and share the third population. units to understand their roles. Sensory inputs from modality 1
   5. Disjoint-mixed (Fig. 4e). This relationship is a combina- sent strongly tuned projections to group 1 units, but not to group
tion of the disjoint and the mixed relationships. Many units only 2 units (Fig. 5c). Group 12 units also received direct, tuned sensory

NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience 301










Proportion

  Articles  NaTure NeuroscieNce

  a  b  Intact  = Lesion group 2
  40  Group  1  Lesion group 1  Lesion group 12
  1
  20  2
  12
  0  0
  0.0  0.5  1.0
  FracVar(Ctx DM 1,
  Ctx DM 2)
  Tasks
  c  d  e  From
  1  To group  From group  1  2 12
  1  1  0.25
  2  0.25  2  1
  0  12  0.00  12  2
  –0.25

  Preferred mod 1 input  Preferred output  12
  direction  direction  –0.40
  f  To group  g  Ctx DM 2 rule input
  1  2   12

  0  1

  –2  12


        2

        Input from rule units Ctx DM 1 rule input

Fig. 5 | Dissecting a reference network for the context-dependent DM tasks. a, The FTV distribution for the Ctx DM 1 and 2 tasks in an example network.
Most units are segregated into three groups on the basis of their FTV values. b, After lesioning all group 1 units together (green), the network could no
longer perform the Ctx DM 1 task, whereas performance for other tasks remained intact. Instead, lesioning all group 12 units disrupted the performance for
all DM tasks. c,d, Average connections from modality 1 input units to recurrent units (c) and from recurrent units to output units (d). Modality 1 input units
made strongly tuned projections to group 1 units. Input and output connections are sorted by each unit’s preferred input and output direction, respectively,
defined as the direction represented by the strongest weight. e, Network wiring architecture that emerged from training, in which group 1 and group 2 units
excited themselves and strongly inhibited each other. Both group 1 and 2 units excited group 12 units. Rec, recurrent. f, Group 1 (2) units received strong
negative connections from rule units representing the Ctx DM 2 (1) task. The boxplot shows the median (horizontal line), the confidence interval of the
median obtained with bootstrapping (notches), lower and upper quartile values (box), and the range of values (whisker). g, Cluster-based circuit diagram
summarizing the neural mechanism of the Ctx DM tasks in the reference network.

inputs from both modalities. All groups projected to the output the Dly Go task can be instructed as ‘remember the direction of the
units (Fig. 5d), although group 12 units were more critical for DM stimulus, then saccade to that direction after the fixation cue goes
(Fig. 5b). Group 1 and group 2 units excited themselves while inhib- off ’. Therefore, the Dly Go task can be expressed as a composition
iting each other. Both projected to group 12 units (Fig. 5e). Group of the Go task with a particular working memory process. Similarly,
1 units received negative connection weights from the rule input the Anti task can be combined with the same working memory pro-
units representing the Ctx DM 2 task (Fig. 5f), which explained why cess to form the Dly Anti task.
group 1 units are silent during context 2. In summary, from train- Here, we tested whether the reference network developed a
ing emerged two groups of units that were specialized for selective simple algebraic form of compositional representations for tasks,
input processing. Along with the sensory inputs from both modali- even when it was never explicitly provided with the relationships
ties, both groups fed into the third group that was specialized for between tasks. We studied the representation of each task as a single
DM (Fig. 5g). Our dissection of a reference network here relies on high-dimensional vector. To compute this ‘task vector’, we averaged
the existence of clusters. Analyzing networks with no cluster, state- neural activities across all possible stimulus conditions in each task
space, and dynamical-system approaches may be more appropriate¹¹. and focused on the steady-state response during the stimulus epoch
        (Fig. 6a). Thus, the neural population state near the end of stimulus
Compositional representations of tasks. A cognitive task can, in presentation was able to represent how the network processed the
general, be expressed abstractly as a sequence of sensory, cognitive stimulus in a particular task to meet the computational need of sub-
and motor processes, and cognitive processes may involve a com- sequent behavioral epochs. Indeed, this idea was confirmed using
bination of basic functions (such as working memory) required principal component analysis, which revealed that task vectors in
to perform the task (Supplementary Table 1). The compositional- the state space spanned by the top two principal components were
ity of cognitive tasks is natural for human subjects because tasks distinct for all 20 tasks (Supplementary Fig. 8).
are instructed with natural languages, which are compositional in We found that the vector pointing from the Go task vector toward
nature¹². For example, the Go task can be instructed as ‘saccade to the Dly Go task vector was very similar to the vector pointing from
the direction of the stimulus after the fixation cue goes off ’, whereas the Anti vector to the Dly Anti vector (Fig. 6b). This finding was

302 NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience










Connection  Connection weight
  weight    from mod 1                                  Units










Connection weight
    to output





                                             Performance







Stim mod 2 Stim mod 1  To










    Response










                                                                Ctx DM 1           Ctx DM 2  DM 1   DM 2  MultSen DM





                    Ctx DM 1 Ctx DM 2        DM 1       DM 2  MultSen DM










                        Rec. weight

    NaTure NeuroscieNce                                                                                                                                       Articles

    a         Neural activity                  Neural activity               State space      However, it is unclear whether in our reference network this prin-
                 Task 1                        Stimulus-free                                  ciple of compositionality can be extended from representing to per-
                                                                                              forming tasks. The network is normally instructed which task to
       Unit 1                                                                   Unit 3        perform by activation of the corresponding rule input unit. What
                                                                                 Task 1       would the network do in response to a compositional rule signal
       Unit 2                                                        Task 2                   as a combination of several activated and deactivated rule units?
                                                                                 Unit 2       We tested whether the network can perform tasks by receiving com-
       Unit 3                                                                Task 3           posite rule inputs (Fig. 7a).
                                                                 Unit 1                                  Consider the same two sets of tasks as in Fig. 6. The network
                                                                                              was able to perform the Dly Anti task well when provided with
                                                                                              the particular combination of rule inputs: Anti + (Dly Go − Go)
    b    2                   Anti               c  2                         Anti             (Fig. 7b). In contrast, the network failed to perform the Dly Anti
                                                                                              task when provided with several other combinations of rule inputs
                                                                                              (Fig. 7b). Similarly, the network can perform the Ctx Dly DM
                                                                                              1 task best when provided the composite rule inputs of Ctx Dly
                                 Go                                              Go           DM 2 + (Ctx DM 1 − Ctx DM 2) (Fig. 7c). In accordance with
             Dly Anti                                           Dly Anti                      these results, we found that connection weights from individual
                                                                                              rule input units to recurrent units also displayed an algebraic com-
                                                                                              positional structure (Supplementary Fig. 9). Similar results were
       –2        Dly Go                           –2             Dly Go                       found when each rule activates and inactivates a distributed set
            –2                            2           –2                                  2   of rule units (Supplementary Fig. 10). However, similar success
                        rPC 1                                               rPC1              was not obtained for the family of matching tasks (DMS, DNMS,
    d    1                   Ctx Dly DM 2       e  1                         Ctx Dly DM 2     DMC, DNMC) (Supplementary Table 1). The network cannot per-
                                                                                              form the DMS task when provided with the composite rule inputs
             Ctx DM 2                                           Ctx DM 2                      DMC + DNMS − DNMC (Supplementary Fig. 11). These results
                                                                                              indicated that the reference networks learned several, but not all,
                                                                                              implicit compositional relationships between tasks.
                               Ctx Dly DM 1                                    Ctx Dly DM 1   In a network with this simple form of compositionality, acquir-
                                                                                              ing a new task may need no modification to the recurrent con-
                                                                                              nections because all components for this task have already been
       –1        Ctx DM 1                         –1            Ctx DM 1                      learned. Instead, a new task may be acquired by learning the appro-
            –2                            2           –2                                  2   priate rule input that controls the information flow in the network².
                        rPC 1                                               rPC 1             To test these hypotheses, we studied how well networks can learn
                                                                                              new tasks when pre-trained on a set of tasks. Networks were able to
    Fig. 6 | compositional representation of tasks in state space. a, The                     learn a new task substantially faster when pre-trained on tasks with
    representation of each task is the population activity of the recurrent                   similar components (Fig. 7d). A network pre-trained on related
    network at the end of the stimulus presentation, averaged across different                tasks was even able to learn a new task by modifying only the con-
    stimulus conditions (black). Gray curves indicate the neural activities in                nection weights from rule input units to the recurrent network
    individual task conditions. b, Representations of the Go, Dly Go, Anti, and               (Fig. 7e). Preliminary analysis showed that Ctx DM-pre-trained
    Dly Anti tasks in the space spanned by the top two principal components                   networks slowly learned the Dly Anti task (Fig. 7e) by engaging
    (PCs) for a sample network. For better comparison across networks, the                    recurrent units that have different preferences for stimulus and
    top two PCs are rotated and reflected (rPCs) to form the two axes (see                    response directions.
    Methods). c, The analysis described in b was performed for 20 networks,
    and the results are overlaid. d, Representations of the Ctx DM 1, Ctx                     Continual task training alters the neural representation. In most
    DM 2, Ctx Dly DM 1, and Ctx Dly DM 2 tasks in the top two PC for a                        of the networks presented so far, all tasks were randomly interleaved
    sample network. e, The analysis described in d was performed for n = 40                   during training, and the networks adjusted all of the connection
    independent networks.                                                                     weights to perform the 20 tasks optimally. However, adult animals
                                                                                              typically learn tasks sequentially. When an adult animal is learn-
                                                                                              ing some new tasks, its brain needs to implicitly balance the need
                                                                                              of learning with the need of retaining past memories. Otherwise,
    robust across many independently trained networks (Fig. 6c). The                          the brain could suffer from a common problem in artificial neural
    Go-to-Dly Go vector and the Anti-to-Dly Anti vector presumably                            networks known as ‘catastrophic forgetting’. Learning new tasks will
    reflect the cognitive process of working memory. Similar findings                         happen at the expense of forgetting previous memories. The net-
    were made with another set of tasks. The vector pointing from the                         work learns to perform a task by modifying parameters to minimize
    Ctx DM 1 task to the Ctx DM 2 task was similar to the vector point-                       the loss function for this task. During sequential training of two
    ing from the Ctx Dly DM 1 task to the Ctx Dly DM 2 task (Fig. 6d,e).                      tasks, if the network uses traditional learning techniques, training
    The Ctx DM 1 to Ctx DM 2 vector reflects the difference between                           for the second task can easily result in the failure of performing the
    the gating modality 1 and the gating modality 2 processes. These                          first task, as the minima of the loss functions of tasks 1 and 2 are far
    results suggest that the representation of a task can potentially be                      apart (Fig. 8a, gray line).
    expressed as the algebraic sum of vectors representing the underly-                                   Continual-learning techniques can protect previously learned
    ing sensory, cognitive, and motor processes. This finding is reminis-                     tasks by preventing large changes of important network parameters
    cent of previous work showing that neural networks can represent                          (Fig. 8a, red line). Here we distinguish sequential training, which
    words and phrases compositionally³².                                                      describes the task presentation, from continual learning, which
                                                                                              refers to particular learning algorithms. Several continual-learning
    Performing tasks with composition of rule inputs. We showed                               methods have recently been proposed to battle catastrophic forget-
    that the representation of tasks could be compositional in principle.                     ting33–35. These methods typically involve selective protection of

    NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience                                                                     303










rPC 2                        rPC 2










rPC 2                        rPC 2

    Articles                                                                     NaTure NeuroscieNce

     a  Activation                Activation                       d            Training all connections
        –1           +1 fo)       –1      +1     fon)                   1                                                1
                                  ==                                                                                        4

                                  ≈

                                                                        0                                                0
                                                                             0        10     20                           0  25 50
                                                                                Total trials (1,000)                        Total trials (1,000)
     b           Performance on     c            Performance on                         Pretrained on
                 Dly Anti (n = 40)           Ctx Dly DM 1 (n = 40)              Go, Dly Go, Anti
                 0.0    0.5   1.0        0.0          0.5   1.0                 —— Ctx DM 1, Ctx DM 2, Ctx Dly DM 2
     Dly Anti                 3  Ctx Dly DM 1               4      e         Training only rule input connections
                                 Ctx Dly DM 2                           1                                                1
         Anti
                                 Ctx Dly DM 2
         Anti                       +Ctx DM 1          fe
      +Dly Go                        Ctx DM 1          It
         Anti                                                                0       500 1,000                            0  500  1,000
      +Dly Go                    Ctx Dly DM 2                           0                                                0
                                    +Ctx DM 1    of
          –Go                       –Ctx DM 2                                Total trials (1,000)                           Total trials (1,000)

    Fig. 7 | Performing tasks with algebraically composite rule inputs. a, During training, a task is always instructed by activation of the corresponding rule
    input unit (left). After training, the network can potentially perform a task by activation or deactivation of a set of rule input units meant for other tasks
    (right). b, The network can perform the Dly Anti task well if given the Dly Anti rule input or the Anti + (Dly Go − Go) rule input. The network fails to
    perform the Dly Anti task when provided other combinations of rule inputs. c, Similarly, the network can perform the Ctx Dly DM 1 task well when provided
    with the Ctx Dly DM 2 + (Ctx DM 1 − Ctx DM 2) rule input. Circles represent the results of individual networks and bars represent median performances
    of 40 networks. The boxplot convention in b,c is the same as the one in Fig. 5f. d, Left, network performance during training of the Dly Anti task when the
    network is pre-trained on Go, Dly Go, and Anti tasks (red), or the Ctx DM 1, Ctx DM 2, and Ctx Dly DM 2 tasks (blue). Right, network performance during
    training of the Ctx Dly DM 1 task under the same pre-training conditions. Individual networks (light); mean across 40 networks (bold). All connections are
    adjusted during training. e, Similar to d, but only training the rule input connections in the second training phase.


connection weights that are deemed important for previously Finally, we analyzed single- and multi-unit recordings from the
learned tasks. By employing one such technique³⁵, we were able frontal eye field of macaque monkeys performing similar context-
to substantially improve the performance of networks that were dependent DM tasks11 (Fig. 8e and Supplementary Fig. 12b–e). The
sequentially trained on a set of cognitive tasks (Fig. 8b,c). Notably, FTV distribution derived from experimental data mainly consists of
all of the networks were initialized with random connection weights. a broad, unimodal distribution, consistent with networks sequen-
The tasks were made easier to facilitate training (see Methods). The tially trained using a continual-learning technique (Fig. 8d, red) and
continual-learning technique was especially effective at helping the with partially plastic networks (Supplementary Fig. 12a, dark blue).
network retain performance of tasks learned earlier. For example, These findings suggest that adult brains do not necessarily develop
the continual-learning networks can retain high performance in a the ‘optimal’ circuit-level solution for newly learned tasks, even if
working memory task (Dly Go) after successfully learning five extra they have been trained for months on the same tasks. Instead, the
tasks (DM1, DM2, MultSen DM, Ctx DM 1, and Ctx DM 2) (Fig. 8b). brain may balance the need between performing the tasks at hand
An example network achieved high performance on the DM1, DM2, and retaining past memories.
and MultSen DM tasks even before being trained on them, suggest-
ing that these tasks rely on structures that can be learned through Discussion
other tasks. In addition, continual learning resulted in a much slower Higher-order cortical areas, especially the lateral prefrontal cortex,
acquisition of difficult tasks (Ctx DM 1 and 2) (Fig. 8c). are markedly versatile in their engagement in a wide range of cogni-
   To understand the impact of continual learning on neural rep- tive functions. Here we investigated how multiple cognitive tasks
resentation, we analyzed the FTV distributions for the Ctx DM 1 are represented in various RNN models. In the networks with non-
and 2 tasks in the sequentially trained networks. The shapes of the saturating activities, we identified clusters of units that were each
FTV distributions were markedly different across networks trained specialized for a subset of tasks. Each cluster potentially represents
with or without the continual-learning technique (Fig. 8d). Instead a particular sequence of the sensori-motor events and a subset of
of a strongly trimodal distribution, the FTV distribution of a con- cognitive processes that serve as these networks’ building blocks
tinual-learning network contained a strong peak at the middle, with for flexible behavior. We showed that realistic neuronal activation
only minor peaks at the two ends. functions28,29 robustly led to clustering across a wide range of net-
   The continual-learning technique works by selective protec- works. In addition, we found that the representation of tasks in our
tion of connection weights, and we can directly mimic this effect network showed a form of compositionality, a critical feature for
by training networks that are partially plastic¹⁷. In contrast with cognitive flexibility. By virtue of the compositionality, a task can
the fully plastic networks, the FTV distributions for the Ctx DM 1 be correctly instructed by composing instructions for other tasks.
and 2 tasks in the partially plastic networks were again mainly uni- Finally, using a recently proposed continual-learning technique,
modal (Supplementary Fig. 12a). we were able to train networks to learn many tasks sequentially.

304 NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience










   Rule input    Rule input units


   Rule input     Recurrent units

                  Rule input units







                       Recurrent units

Performance of    Performance of
   Dly Anti                   Dly Anti










Performance of    Performance of
 Ctx Dly DM 1     Ctx Dly DM 1

    NaTure NeuroscieNce                                                                                                                                   Articles
    a           Traditional learning                                     c    1        Go                  1    MultSen DM
                Continual learning
                                                                Task 1
                                                                Task 2
                                                                Task 1 + 2
                                                                              0                            0
                                                                              1             Dly Go         1     Ctx DM 1

                                                                              0               DM 1         0     Ctx DM 2
                                        Parameter θ                           1                            1

    b                                   Traditional learning                  0               DM 2         0
                                                                              1
                                        Continual learning
         1.0
                                                                              0    0        2,800
                                                                                       Total trials (1,000)
         0.5
                                                                    d                                         e  PFC data (Mante et al. 2013)
         0.0                                                                  0.2                             20
                                                                              0.1                             10

                                                                              0.0                              0
                                                                                       –1     0     1          –1             0 1
                                                                                   FTV(Ctx DM 1, Ctx DM 2)         FTV(Ctx DM 1, Ctx DM 2)

    Fig. 8 | Sequential training of cognitive tasks. a, Schematics of continual learning compared with traditional learning. Network parameters (such as
    connection weights) optimal for a new task can be destructive for old tasks. Arrows show changes of an example parameter θ when task 2 is trained after
    task 1 is already learned. b, Final performance across all trained tasks with traditional (gray) or continual (red) learning techniques. Lines represent the
    results of individual networks. Only networks that achieved more than 80% accuracy on Ctx DM 1 and 2 are shown. c, Performance of all tasks during
    sequential training. Example networks used traditional (gray) or continual (red) learning techniques, respectively. For each task, the black box indicates the
    period in which this task was trained. DM 1 and 2 tasks were trained in the same block to prevent bias, as were Ctx DM 1 and 2 tasks. d, FTV distributions
    for networks with traditional (gray) or continual (red) learning techniques. Solid lines are median over 20 networks. Shaded areas indicate the 95%
    confidence interval of the median estimated from bootstrapping. e, The FTV computed using single-units data from the prefrontal cortex of a monkey
    performing Ctx DM 1 and 2 (ref. 11).

    The FTV distributions in continual-learning networks were sub-                 following compositional rule instructions6,38. They trained linear clas-
    stantially more mixed, and are consistent with those computed from             sifiers to decode rules from prefrontal neural activity patterns. These
    prefrontal data in monkeys performing similar tasks.                           classifiers can substantially generalize to novel tasks⁶, consistent with
           Functional specialization is one of the most fundamental design         a compositional neural representation of rules. Although trained
    principle of the brain³⁶, dating back to Broca’s area. The brain is            with discrete rule instructions, our reference network develops a clear
    partitioned into specialized areas, and each brain area consists of            compositional structure in its representations for two sets of tasks, as
    genetically and functionally distinct cell types. In contrast, theoreti-       shown using the population activity. However, it is unlikely that our
    cal studies argued that for maximum cognitive flexibility, prefrontal          network possesses a more general form of compositionality, which
    neurons should be selective to mixtures of multiple task variables³⁷.          requires that task components can be arbitrarily and recursively com-
    Mixed selectivity neurons are indeed ubiquitous inside the prefron-            bined to perform complex new tasks. Indeed, our network is not able
    tal cortex10,23. These findings pose a challenging conceptual ques-            to perform the DMS task using composite rule inputs; more broadly,
    tion: when is functional specialization desired, and when is it not?           it remains unclear whether standard modern recurrent network
    Our results suggest a tentative unifying answer to this question. For          architectures can accomplish challenging compositional tasks39,40.
    a computation that is repeatedly performed and shared in various                             Similar to other works on trained neural networks11,14–19,41, the
    behaviors, it is computationally beneficial to develop a function-             machine learning protocol we used is not validated biologically.
    ally specialized circuit for it. In neural networks, functional spe-           Furthermore, in our network, a rule input is explicitly provided
    cialization can be achieved by training multiple inter-related tasks           throughout the trial, therefore there is no need for the network to
    simultaneously. In biological brains, specialization is potentially            hold the ‘task set’ internally using persistent activity4,5. This, however,
    achieved through evolution and development, instead of learning                can be remedied by providing the rule cue only at the beginning of
    in adulthood. Mixed selectivity, on the other hand, can be beneficial          each trial, which would encourage the network to internally sustain
    to a neural system that needs to maintain both flexibility for future          the task set. We can even ask the network to figure out a task rule
    learning and memories from the past. The process of learning new               by trial-and-error⁴². In spite of these concerns, our approach offers
    cognitive tasks in adult brains is probably better modeled in neural           an efficient computational platform to test hypotheses about neu-
    networks using a continual-learning paradigm.                                  ral representations and mechanisms that could guide experiments
             The neural mechanism behind multiple cognitive tasks has been         and data analysis. Future progress in this direction, at the interface
    investigated in human imaging studies. In a series of experiments,             between neuroscience and artificial intelligence, will advance our
    Cole and colleagues trained humans to perform 64 cognitive tasks               understanding of flexible behavior in many cognitive tasks.

    NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience                                                                 305










    Performance                         Loss L










Proportion                              Performance










  Units










         Go     Dly Go  DM 1            DM 2MultSen DM Ctx DM 1 Ctx DM 2

Articles                                                                                     NaTure NeuroscieNce

online content                                                                          26. Miller, E. K., Erickson, C. A. & Desimone, R. Neural mechanisms of visual
Any methods, additional references, Nature Research reporting                            working memory in prefrontal cortex of the macaque. J. Neurosci. 16,
summaries, source data, statements of data availability and asso-                       27. 5154–5167 (1996).
ciated accession codes are available at https://doi.org/10.1038/                         Freedman, D. J. & Assad, J. A. Neuronal mechanisms of visual categorization:
s41593-018-0310-2.                                                                       an abstract view on decision making. Annu. Rev. Neurosci. 39,
                                                                                         129–147 (2016).
                                                                                        28. Priebe, N. J. & Ferster, D. Inhibition, spike threshold, and stimulus selectivity
Received: 16 July 2018; Accepted: 30 November 2018;                                      in primary visual cortex. Neuron 57, 482–497 (2008).
Published online: 14 January 2019                                                       29. Abbott, L. F. & Chance, F. S. Drivers and modulators from push-pull and
                                                                                         balanced synaptic input. Prog. Brain. Res. 149, 147–155 (2005).
References                                                                              30. Wang, X.-J. Probabilistic decision making by slow reverberation in cortical
1.   Fuster, J. The Prefrontal Cortex (Academic Press, Cambridge, 2015).                31. circuits. Neuron 36, 955–968 (2002).
2.   Miller, E. K. & Cohen, J. D. An integrative theory of prefrontal cortex             Sussillo, D. & Barak, O. Opening the black box: low-dimensional dynamics in
     function. Annu. Rev. Neurosci. 24, 167–202 (2001).                                  high-dimensional recurrent neural networks. Neural Comput. 25,
3.   Wang, X.-J. in Principles of Frontal Lobe Function (Stuss, D. T. & Knight, R. T.   32. 626–649 (2013).
     eds.) (Cambridge Univ. Press, New York, 2013).                                      Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S. & Dean, J. Distributed
4.   Wallis, J. D., Anderson, K. C. & Miller, E. K. Single neurons in prefrontal         representations of words and phrases and their compositionality. Adv. Neural.
     cortex encode abstract rules. Nature 411, 953–956 (2001).                          33. Inf. Process. Syst. 26, 3111–3119 (2013).
5.   Sakai, K. Task set and prefrontal cortex. Annu. Rev. Neurosci. 31, 219–245          Benna, M. K. & Fusi, S. Computational principles of synaptic memory
     (2008).                                                                            34. consolidation. Nat. Neurosci. 19, 1697–1706 (2016).
6.   Cole, M. W., Etzel, J. A., Zacks, J. M., Schneider, W. & Braver, T. S. Rapid        Kirkpatrick, J. et al. Overcoming catastrophic forgetting in neural networks.
     transfer of abstract rules to novel contexts in human lateral prefrontal cortex.   35. Proc. Natl Acad. Sci. USA 114, 3521–3526 (2017).
     Front. Hum. Neurosci. 5, 142 (2011).                                                Zenke, F., Poole, B. & Ganguli, S. Continual learning through synaptic
7.   Tschentscher, N., Mitchell, D. & Duncan, J. Fluid intelligence predicts novel      36. intelligence. ICML 70, 3987–3995 (2017).
     rule implementation in a distributed frontoparietal control network.                Kanwisher, N. Functional specificity in the human brain: a window into the
     J. Neurosci. 37, 4841–4847 (2017).                                                  functional architecture of the mind. Proc. Natl Acad. Sci. USA 107,
8.   Hanes, D. P., Patterson, W. F. II & Schall, J. D. Role of frontal eye              37. 11163–11170 (2010).
     fields in countermanding saccades: visual, movement, and fixation activity.         Rigotti, M., Ben Dayan Rubin, D., Wang, X.-J. & Fusi, S. Internal
     J. Neurophysiol. 79, 817–834 (1998).                                                representation of task rules by recurrent dynamics: the importance of the
9.   Padoa-Schioppa, C. & Assad, J. A. Neurons in the orbitofrontal cortex encode       38. diversity of neural responses. Front. Comput. Neurosci. 4, 24 (2010).
     economic value. Nature 441, 223–226 (2006).                                         Cole, M. W. et al. Multi-task connectivity reveals flexible hubs for adaptive
10. Rigotti, M. et al. The importance of mixed selectivity in complex cognitive         39. task control. Nat. Neurosci. 16, 1348–1355 (2013).
     tasks. Nature 497, 585–590 (2013).                                                  Yang, G. R., Ganichev, I., Wang, X.-J., Shlens, J. & Sussillo, D. A dataset
11. Mante, V., Sussillo, D., Shenoy, K. V. & Newsome, W. T. Context-dependent            and architecture for visual reasoning with a working memory. ECCV
     computation by recurrent dynamics in prefrontal cortex. Nature 503,                40. 714–731 (2018)..
     78–84 (2013).                                                                       Lake, B. M. & Baroni, M. Generalization without systematicity: On the
12. Cole, M. W., Laurent, P. & Stocco, A. Rapid instructed task learning: a new          compositional skills of sequence-to-sequence recurrent networks. ICML 80,
     window into the human brain’s unique capacity for flexible cognitive control.      41. 2873–2882 (2017).
     Cogn. Affect. Behav. Neurosci. 13, 1–22 (2013).                                     Yamins, D. L. K. et al. Performance-optimized hierarchical models predict
13. Reverberi, C., Görgen, K. & Haynes, J.-D. Compositionality of rule                   neural responses in higher visual cortex. Proc. Natl Acad. Sci. USA 111,
     representations in human prefrontal cortex. Cereb. Cortex 22,                      42. 8619–8624 (2014).
     1237–1246 (2012).                                                                   Song, H. F., Yang, G. R. & Wang, X.-J. Reward-based training of recurrent
14. Zipser, D. & Andersen, R. A. A back-propagation programmed network that              neural networks for cognitive and value-based tasks. eLife 6, e21492 (2017).
     simulates response properties of a subset of posterior parietal neurons. Nature    acknowledgements
     331, 679–684 (1988).
15. Song, H. F., Yang, G. R. & Wang, X.-J. Training excitatory-inhibitory               We thank current and former members of the Wang lab, especially S.Y. Li, O. Marschall,
     recurrent neural networks for cognitive tasks: a simple and flexible               and E. Ohran for fruitful discussions; J.A. Li, J.D. Murray, D. Ehrlich, and J. Jaramillo for
     framework. PLoS Comput. Biol. 12, e1004792 (2016).                                 critical comments on the manuscript; and S. Wang for assistance with the NYU HPC
16. Carnevale, F., de Lafuente, V., Romo, R., Barak, O. & Parga, N. Dynamic             clusters. We are grateful to V. Mante for providing data and for discussion. This work
     control of response criterion in premotor cortex during perceptual detection       was supported by an Office of Naval Research grant no. N00014-13-1-0297, a National
     under temporal uncertainty. Neuron 86, 1067–1077 (2015).                           Science Foundation grant no. 16-31586, a Google Computational Neuroscience Grant
17. Rajan, K., Harvey, C. D. & Tank, D. W. Recurrent network models of                  (X.J.W.), a Samuel J. and Joan B. Williamson Fellowship, a National Science Foundation
     sequence generation and memory. Neuron 90, 128–142 (2016).                         Grant Number 1707398, and the Gatsby Charitable Foundation (G.R.Y.).
18. Chaisangmongkon, W., Swaminathan, S. K., Freedman, D. J. & Wang, X.-J.
     Computing by robust transience: how the fronto-parietal network performs           author contributions
19. sequential, category-based decisions. Neuron 93, 1504–1517 (2017).                  G.R.Y. and X.J.W. designed the study. G.R.Y., M.R.J., H.F.S, W.T.N., and X.J.W. had
     Eliasmith, C. et al. A large-scale model of the functioning brain. Science 338,    frequent discussions. G.R.Y. and M.R.J. performed the research. G.R.Y., H.F.S, W.T.N.,
20. 1202–1205 (2012).                                                                   and X.J.W. wrote the manuscript.
     Funahashi, S., Bruce, C. J. & Goldman-Rakic, P. S. Mnemonic coding of
     visual space in the monkey’s dorsolateral prefrontal cortex. J. Neurophysiol.
     61, 331–349 (1989).                                                                competing interests
21. Gold, J. I. & Shadlen, M. N. The neural basis of decision making. Annu. Rev.        The authors declare no competing interests.
     Neurosci. 30, 535–574 (2007).
22. Siegel, M., Buschman, T. J. & Miller, E. K. Cortical information flow during        additional information
     flexible sensorimotor decisions. Science 348, 1352–1355 (2015).
23. Raposo, D., Kaufman, M. T. & Churchland, A. K. A category-free neural               Supplementary information is available for this paper at https://doi.org/10.1038/
     population supports evolving demands during decision-making. Nat.                  s41593-018-0310-2.
     Neurosci. 17, 1784–1792 (2014).                                                    Reprints and permissions information is available at www.nature.com/reprints.
24. Romo, R., Brody, C. D., Hernández, A. & Lemus, L. Neuronal correlates               Correspondence and requests for materials should be addressed to X.-J.W.
     of parametric working memory in the prefrontal cortex. Nature 399,
     470–473 (1999).                                                                    Publisher’s note: Springer Nature remains neutral with regard to jurisdictional claims in
25. Munoz, D. P. & Everling, S. Look away: the anti-saccade task and the                published maps and institutional affiliations.
     voluntary control of eye movement. Nat. Rev. Neurosci. 5, 218–228 (2004).          © The Author(s), under exclusive licence to Springer Nature America, Inc. 2019







306    NaTuRe NeuRoScieNce | VOL 22 | FEBRUARY 2019 | 297–306 | www.nature.com/natureneuroscience

NaTure NeuroscieNce                                                                                                                                                                          Articles

Methods                                                                                                   The rule input unit corresponding to the current task will be activated throughout
Network structure. The RNNs shown in the main text all contain N    rec              = 256                the whole trial. The network receives a fixation input, which is activated from the
units. The results are largely insensitive to the network size. Similar results were                      beginning of the trial. When the fixation input is on, the network should fixate
obtained in networks of sizes between 128 and 512 units (the range we tested).                            by having the fixation output unit at a high activity z                         fix= 0 85. . The offset of the
Every network is a time-discretized RNN with positive activity¹⁵. Before time                             fixation input usually indicates the onset of the response or go epoch, when the
discretization, the network activity r follows a continuous dynamical equation                            network needs to report the response direction through activities of the output
                                                                                                          ring. During the response epoch, the fixation output unit has a target output of
     τ                drdt    = − +r    f    (Wrecr + W inu + b +  2τσrec2     ξ)                         zfix = 0 05.         . For a target response direction ψ, the target output activity of an
                                                                                                          output unit i is
 In this equation, τ = 100ms is the neuronal time constant. Real neurons                                                                          z = 0 8 exp.   − 1 8 ∣ψ−ψi∣ 2
typically have shorter time constants around 20ms, here the 100ms time constant                                                                   i                 2     π               + 0 05.
                                                                                                                                                                                      
mimics the slower synaptic dynamics on the basis of NMDA receptors³⁰. u is                                                                                       
the input to the network, b is the bias or background input, f(⋅) is the neuronal
nonlinearity, ξ are N     independent Gaussian white noise processes with zero                            where ψ              is the preferred response direction of unit i. When no response is required,
                      rec                                                                                                     i
mean and unit variance and                                                                                the target output activity is fixed at
setting, we use a standard Softplus functionσʳᵉᶜ = 0.05 is the strength of the noise. In the reference                                                           zi = 0 05. . The network also receives one or two
                                                                                                          stimuli. Each stimulus contains information from modality 1, 2 or both. When
                              f     ( )x   = log(1 + exp( ))x                                             there is only one stimulus, the direction of the stimulus is drawn from a uniform
                                                                                                          distribution between 0 and 360°.
which after re-parameterization is very similar to a neuronal nonlinearity, that is,                          A trial is considered correct only if the network correctly maintained fixation
the frequency-current curve, commonly used in previous neural circuit models²⁹.                           and responded to the correct direction. The response direction of the network is
A set of output units z read out nonlinearly from the network,                                            read out using a population vector method. The decoded response direction is
                                                                                                          considered correct if it is within 36° of the target direction. If the activity of the
                                           z = g W(  outr)                                                fixation output falls below 0.5, the network is considered to have broken fixation.
                                                                                                              The discrimination thresholds a in Supplementary Fig. 2 are obtained by
where g(x)= 1/(1 + exp(−x)) is the logistic function, bounding output activities                          fitting Weibull functions to performances p as a function of coherences c at a fixed
between 0 and 1. Wⁱⁿ, Wʳᵉᶜ, Wout are the input, recurrent and output connection                           stimulus duration,p=
matrices, respectively.                                                                                                       1− .0 5 exp(−(c a∕  ) )b
 After using the first-order Euler approximation with a time-discretization step                              Each task can be separated into distinct epochs. Fixation (fix) epoch is the
Δ t, we have                                                                                              period before any stimulus is shown. It is followed by the stimulus epoch 1
                                                                                                          (stim1). If there are two stimuli separated in time, then the period between the
 rt = (1−α)rt−1 + αf (W recrt−1 + W inut+ b +     2α−1σrec2                  N(0, 1))                     two stimuli is the delay epoch and the second stimulus is shown in the stimulus
                                                                                                          epoch 2 (stim2). The period when the network should respond is the go epoch.
                                                                                                          The duration of the fixation, stim1, delay1, stim2 and go epochs are Tfix, Tstim1, Tdelay1,
 Here α ≡ Δ t/τ, and N(0,1) stands for the standard normal distribution. We                               Tstim2, Tgo, respectively. For convenience, we grouped the 20 tasks into five task
use a discretization step Δt = 20 ms. We imposed no constraint on the sign or the                         families: the Go, Anti, DM, Delayed Decision Making (Dly DM), and
structure of the weight matrices Wⁱⁿ, Wʳᵉᶜ, Wᵒᵘᵗ. The network and the training are                        Matching families.
implemented in TensorFlow.
 The network receives four types of noisy input,                                                          Go task family. This family of tasks includes the Go, RT Go and Dly Go tasks. In all
                              u = (ufix, umod1, umod2, urule) + unoise                                    three tasks, a single stimulus is randomly shown in either modality 1 or 2, and the
                              unoise =      2∕α σinN(0, 1)                                                response should be made in the direction of the stimulus. These three tasks differ
                                                                                                          in their stimulus onset and offset times. In the Go task, the stimulus appears before
                                                                                                          the fixation cue goes off. In the RT Go task, the fixation input never goes off, and
 Here the input noise strength σin= 0.01. The fixation input ufix is typically at                         the network should respond as soon as the stimulus appears. In the Dly Go task,
the high value of 1 when the network should fixate. The fixation input goes to                            a stimulus appears briefly and is followed by a delay period until the fixation cue
0 when the network is required to respond. The stimulus inputs u                     and umod2            goes off. The Dly Go task is similar to the memory-guided saccade task²⁰.
                                                                              mod1                            For the Go task,
comprise two ‘rings’ of units, each representing a one-dimensional circular variable
described by the degree around a circle. Each ring contains 32 units, whose
preferred directions are uniformly spaced from 0 to 2π. For unit i with a preferred                                                                        Tstim1~ U(500, 1500)
direction θi, its activity for a stimulus presented at direction ψ is                                     U(t 1
                                                                 ∣ψ−ψ∣ 2                                 ,t₂) is a uniform distribution between t1 and t₂. The unit for time is milliseconds
                                                                                                          and is omitted for brevity. For the RT Go task,
                              u = γ ⋅ .0 8 exp −
                                i               12 8   π i                                                                                 Tstim1~ U(500, 2500)

where γ is the strength of the stimulus. For multiple stimuli, input activities are                           For the Dly Go tasks,
added together. The network also receives a set of rule inputs urule that encode                                                                       T   ~ U({200, 400, 800, 1600})
which task the network is supposed to perform on each trial. Normally, u                 is a                                                        delay1
                                                                                     rule
one-hot vector. That means the rule input unit corresponding to the current task
is activated at 1, while other rule input units remain at 0. Therefore, the number                        Here U({a₁, …, aₙ}) denotes a discrete uniform distribution over the set {a₁, …, aₙ}.
of rule input units equals to the number of tasks trained. For compositional rule
inputs (Fig. 7), the activation of rule input units can be an arbitrary pattern. For                      Anti task family. This family includes the Anti, RT Anti and Dly Anti tasks. These
example, for the combined rule input Anti+ (Dly Go − Go), the activities of the                           three tasks are the same as their counterpart Go-family tasks, except that the
rule input units corresponding to the Go, Dly Go and Anti tasks are −1, +1 and +1,                        response should be made to the opposite direction of the stimulus.
respectively. For Supplementary Fig. 10, each rule activates/inactivates a distributed
set of 20 rule input units. The rule unit activation patterns for different rules are                     DM family. This family includes five perceptual DM tasks: the DM 1, DM 2, Ctx
orthogonal to each other. They are chosen from rows of a random orthogonal                                DM 1, Ctx DM 2 and MultSen DM tasks. In each trial, two stimuli are shown
matrix, generated using the Python package scipy.stats.ortho_group. In total, there                       simultaneously and are presented till the end of the trial. Stimulus 1 is drawn
are Nin= 1+ 32 ×2+ 20 = 85 input units.                                                                   randomly between 0 and 360°, while stimulus 2 is drawn uniformly between 90
 The network projects to an output ring zout, which also contains 32 units. The                           and 270° away from stimulus 1. In DM 1, the two stimuli only appear in modality 1,
output ring units encode the response directions using similar tuning curves to the                       while in DM 2 the two stimuli only appear in modality 2. In DM 1 and DM 2, the
ones used for the input rings. In addition, the network projects to a fixation output                     correct response should be made to the direction of the stronger stimulus (the
unit zfix, which should be at the high activity value of 1 before the response and at 0                   stimulus with higher γ). In Ctx DM 1, Ctx DM 2 and MultSen DM tasks, each
once a response is generated. In total, there are Nout= 1+ 32 = 33 output units.                          stimulus appears in both modality 1 and 2. In the Ctx DM 1 task, information
 We lesion a network unit by setting to 0 its projection weights to all recurrent                         from modality 2 should be ignored, and the correct response should be made
and output units.                                                                                         to the stronger stimulus in modality 1. In the Ctx DM 2 task, information from
                                                                                                          modality 1 should be ignored. In the MultSen DM task, the correct response
Tasks and performances. Here we first describe the common setup for the 20 tasks                          should be made to the stimulus that has a stronger combined strength in
trained. Deviations from the common setup will be described below individually.                           modalities 1 and 2.

NaTuRe NeuRoScieNce | www.nature.com/natureneuroscience

Articles                                                                                                                                                                                          NaTure NeuroscieNce

                                        The DM 1 and DM 2 tasks are inspired from classical perceptual DM tasks   stimulus if the two stimuli are matched and maintain fixation otherwise. In the
based on random-dot motion stimuli²¹. In random-dot motion tasks, there is only                                   DNMS and DNMC tasks, the network should respond only if the two stimuli are
one stimulus, the coherence of which is varied across trials. Following the tradition                             not matched, that is, a non-match, and fixate when it is a match.
of Wang³⁰, we use two input stimuli to model momentary motion evidence toward                                      During training of these tasks, half of the trials are matching and the other half
the two target directions. When the two stimuli have the same strengths (γ₁ = γ₂),                                are non-matching. In DMS and DNMS tasks, stimulus 1 is always drawn randomly.
there is no net evidence toward any target direction, mimicking the condition                                     In half of the trials, stimulus 2 appears at the same direction as stimulus 1. In the
of 0 motion coherence in the random-dot motion task. A stronger difference in                                     other half, stimulus 2 is drawn randomly between 10 and 350° away from stimulus
the stimulus strengths emulates a stronger motion coherence. For a coherence c                                    1. In DMC and DNMC tasks, both stimulus 1 and 2 are drawn randomly and
representing net evidence for the direction of stimulus 1, the strengths of stimulus                              independently from the uniform distribution
1 and 2 (γ₁,γ₂) are set as                                                                                                    U({18, 54, 90, 126, 162, 198, 234, 270, 306, 342})
                               γ1,mod i = γ + c, γ2,mod i = γ−c                                                    In all Matching family tasks,
respectively, where i∈{1,2} is the modality. Here, γ is the average strength of the                                                         Tdelay1~ U({200, 400, 800, 1600})
two stimuli. For each trial, we draw γ from a uniform distribution around 1,
γ ~ U(0 8, 1 2). .                      . Indeed, in all DM-family tasks and Dly DM-family tasks, there is a
single coherence c in each trial that determines the overall strength of net evidence                              Also, match trials and non-match trials always appear with equal probability.
toward the direction represented by stimulus 1. For all DM-family tasks,                                          Training procedure. The loss L to be minimized is computed by time-averaging
                   c ~ U({− .0 08, − .
                                   0 04, − .
                                                                       0 02, − .
                                            0 01, 0 01, 0 02, 0 04, 0 08}).  .       . .                          the squared errors between the network output z(t) and the target output z( )t        .
                                                                                                                   L = L   ≡ 〈mi t(zi t − ^zi t)2〉i t .Here, i is the index of the output units. The
 The duration of stimulus 1, which is fixed in each trial, is drawn from the                                           mse    ,      ,      ,    ,
                                                                                                                  squared errors at different time points and of different output units are potentially
following distribution,                                                                                           weighted differently according to the non-negative mask matrix mi    ,t . For the output
                                                   Tstim1~ U({400, 800, 1600})                                    ring units, before the response epoch, we have mi,t  = 1. The first 100 ms of the
                                                                                                                  response epoch is a grace period with mi,t      = 0, while for the rest of the response
 Indeed, all tasks from the DM family use the same distribution for T                                             epoch, mi,t=5. For the fixation output unit,mi,t is two times stronger than the mask
                                            stim1
since the two stimuli are shown simultaneously,                          Tstim1= T .      . And                   for the output ring units.
                                            stim2                                                                  The training is performed with Adam, a powerful variant of stochastic gradient
 The Ctx DM 1 and Ctx DM 2 tasks are inspired from context-dependent DM
tasks performed by macaque monkeys¹¹. Now each stimulus is presented in both                                      descent⁴³. We used the default set of parameters. The learning rate is 0.001, the
modalities at the same direction, with strengths γ1,mod1,γ1,mod2 for stimulus 1, and                              decay rate for the first and second moment estimates are 0.9 and 0.999, respectively.
γ2,mod1,γ2,mod2 for stimulus 2. The stimulus strengths are determined by the coherence                            q⋅ 1 The recurrent connection matrix is initialized with a scaled identity matrix
for modality 1 and 2 (cmod1,cmod2), so we have                                                                     44, where 1 is the identity matrix. We chose q= 0.5 such that the gradient is
                                                                                                                  roughly preserved during backpropagation when the network is initialized. The
                      γ1,mod1= γmod1+ cmod1,                        γ2,mod1= γmod1−cmod1                          input and output connection weights are initialized as independent Gaussian
                                                                                                                  random variables with mean 0, and standard deviations 1∕   Nin and 0 4
                                                                                                                                                                                          . ∕ Nrec,
A similar equation holds for modality 2 as well. cmod1 and cmod2 are drawn                                        respectively. The standard deviation value for the output weights is chosen to
independently from the same distribution. In Ctx DM 1, c= cmod1, while in Ctx DM 2,                               prevent saturation of output units after initialization.
c= cmod2. γ           and γ                    are also drawn from U(0.8,1.2). In the original Mante task¹¹,       During training, we randomly interleaved all the tasks with equal probabilities,
     mod1             mod2                                                                                        except for the Ctx DM 1 and Ctx DM 2 tasks that appear five times more
there is another delay period between the stimuli and the response period, which is
not included here.                                                                                                frequently, because without sufficient training, the network gets stuck at an
 The MultSen DM task mimics a multi-sensory integration task²³. The setup                                         alternative strategy. Instead of correctly ignoring modality 1 or 2, the network
of stimulus is similar to those in the Ctx DM 1 and Ctx DM 2 tasks, except that                                   can choose to ignore the context and integrate information from both modalities
the network should integrate information from both modalities and the stronger                                    equally. This strategy gives the network an accuracy close to 75%. During training,
stimulus is the one with higher averaged strength from modality 1 and 2. The                                      we used mini-batches of 64 trials, in which all trials are generated from the same
overall coherence c= (cmod1 + cmod2)/2. We determine all four strengths with the                                  task for computational efficiency.
following procedure. First, we determine the average strength of stimulus 1 across                                Task variance analysis. A central goal of our analysis was to determine whether
both modalities, γ₁, and the average strength of stimulus 2, γ₂:                                                  individual units in the network are selective to different tasks, or whether units
                                   γ1 = γ + c,                        γ2 = γ−c                                    tended to be similarly selective to all tasks. To quantify how selective a unit is in
                                                                                                                  one task, we defined a task variance metric. To compute the task variance TVi(A)
 Here, γ and c both follow the same distributions as other DM-family tasks.                                       for task A and unit i, we ran the network for many stimulus conditions that span
Then we setγ     = γ (1 + Δ1), γ     = γ (1−Δ ) ,                           Δ ~      .      ∪                     the space of possible stimuli. For example, in the DM family tasks, we ran the
                                            0 4, − .                                                              network for stimuli with directions ranging from 0 to 360° and with coherences
 1,mod1            1           1,mod2   1      1                       where 1  U(0 1, 0 4).   U(− .
This is similar for stimulus 2.             0 1).                                                                 ranging from almost 0 to 0.2. After running the network for many stimulus
                                                                                                                  conditions, we computed the variance across stimulus conditions (trials) at each
Dly DM family. This family includes Dly DM 1, Dly DM 2, Ctx Dly DM 1 and Ctx                                      time point for a specific unit then averaged the variance across all time points
Dly DM 2. These tasks are similar to the corresponding tasks in the DM family,                                    to get the final task variance for this unit. The fixation epoch is excluded from
except that in the Dly DM family tasks, the two stimuli are separated in time. The                                this analysis. To eliminate the effect of recurrent noise, private noise to recurrent
Dly DM 1 and Dly DM 2 tasks are inspired by the classical parametric working                                      units is set to zero in this analysis. This process was repeated for each unit in the
memory task developed by Romo and colleagues²⁴. The two stimuli are both shown                                    network. Therefore,
briefly and are separated by a delay period. Another short delay period follows the                                                         TV(A) = 〈[ ( , )
offset of the second stimulus.                                                                                                                 i      r j ti  − 〈r ji( ′, )t 〉 j′]2 〉j t,
 For all Dly DM family tasks,                                                                                     where ri(j,t) is the activity of unit i on time t of trial j. In Figs. 2 and 4, we only
                      Tdelay1~ U({200, 400, 800, 1600})                                                           analyzed active units, defined as those that have summed task variance across tasks
                      c ~ U({− .0 32, − .                                                                         higher than a threshold, 10−3. The results do not depend strongly on the choice of
                                        0 16, − .
                                            0 08, 0 08, 0 16, 0 32}).      .     .                                the threshold. This procedure prevents units with extremely low task variance from
 and Tstim1= Tstim2= 300.                                                                                         being included in the analysis.
                                                                                                                   By computing each unit’s selectivity across different stimulus conditions, we
                                                                                                                  naturally include the selectivity to motor outputs, because motor outputs depend
Matching family. This family of tasks includes the DMS, DNMS, DMC, DNMC                                           ultimately on the stimuli. A unit that is only selective to motor outputs or other
tasks. In these tasks, two stimuli are presented consecutively and separated by a                                 cognitive variables in a task will still have a non-zero task variance. Units that are
delay period. Each stimulus can appear in either modality 1 or 2. The network                                     purely selective to rules and/or time will, however, have zero task variance and
response depends on whether or not the two stimuli are ‘matched’. In the DMS                                      therefore be excluded from our analysis.
and DNMS tasks, two stimuli are matched if they point toward the same direction,                                   The clustering of units based on their task variance patterns in Fig. 2 uses
regardless of their modalities. In DMC and DNMC tasks, two stimuli are matched                                    k-means clustering from the Python package scikit-learn. To assess how well
if their directions belong to the same category. The first category ranges from 0 to                              a clustering configuration is, we computed its silhouette score on the basis
180°, while the rest from 180 to 360° belong to the second category. In the DMS                                   of intracluster and intercluster distances. The silhouette score of an unit i is
and DMC tasks, the network should respond toward the direction of the second                                      1− di,intra/di,inter (assuming di,intra < di,inter), where di,intra is the average distance of this

                                                                                                                                                              NaTuRe NeuRoScieNce | www.nature.com/natureneuroscience

NaTure NeuroscieNce                                                                                                                                                                      Articles

unit with other units in the same cluster, and di                                             is average distance between this                        The sum over η is taken over all connection weights in the network, including
                                                                                          ,inter
unit and units in the nearest cluster. The silhouette score of a clustering scheme is                                               input, recurrent and output weights. We used βL1,weight = 0,10−5,10−4,10−3.
the average silhouette score of all units. A higher silhouette score means a better                                                     In total, 256(= 2×2×2×4×4) networks are trained. None of the leaky RNN
clustering. We computed the silhouette for the number of clusters ranging from 2∼                                                   networks with Tanh and ReTanh activation functions learned to perform
to 30. The optimal number of clusters k is determined by choosing the k with the                                                    all 20 tasks.
highest silhouette score.
 In Fig. 2d, we visualize the clustering using tSNE. For each unit, the normalized                                                  Analysis of the Ctx DM 1 and 2 tasks. Group 1, 2 and 12 units in Fig. 5 are
task variances across all tasks form a 20-dimensional vector that is then embedded                                                  defined as those units that have FTV(Ctx DM 1, Ctx DM 2) larger than 0.9, smaller
in a two-dimensional space. For the tSNE method, we used the exact method for                                                       than 0.1, and in between 0.4 and 0.6. In Fig. 5e, we did not directly plot the average
gradient calculation, a learning rate of 100 and a perplexity of 30.                                                                connection weights between groups, because that would include many connections
 The FTV with respect to tasks A and B is                                                                                           from units with different input preferences. So we only analyzed connections
                                                                                                                                    between units with similar input preferences. The input preference of an unit
                         FTV(i       A B,   ) =                                TV(A)i     −TV( )i          B                        is defined as the direction of inputs that sends the strongest modality 1 and 2
                                                                                 TV(i  A) + TV( )i         B                        summed projection. Two units are defined to have similar input preferences if the
                                                                                                                                    distance between their preferred directions is less than π/6. The notched box-and-
 To obtain a statistical baseline for the FTV distributions as in Supplementary                                                     whisker plots in Fig. 5f and elsewhere showed the medians (line), the confidence
Fig. 6, we transform the neural activities of the network with a random orthogonal                                                  interval of the median (notch) estimated through bootstrapping, the lower and
matrix before computing the task variance. For each network, we generate a                                                          upper quartile of the distribution (box) and the range of the data (whisker). These
random orthogonal matrix M using the Python package Scipy. All network                                                              plots are generated with the Python function matplotlib.pyplot.boxplot.
activities are multiplied by this matrix M to obtain a rotated version of the original
neural representation.                                                                                                              State-space analysis. To compute the representation of a task in the state space,
                                                                                                                                    we first computed the neural activities across all possible stimulus conditions, then
                                                rtrot = Mrt                                                                         we averaged across all these conditions. For simplicity of the analysis, we chose to
                                                                                                                                    analyze only the steady-state responses during the stimulus epoch. We do so by
 Since multiplying neural activities by an orthogonal matrix is equivalent to                                                       focusing on the last time point of the stimulus epoch, tstim1,end. So the representation
rotating and reflecting the neural representation in state space, this procedure will                                               of task A is
preserve results from state-space analysis. We then compute task variances and
FTV using the rotated neural activities. The FTV distributions using the rotated                                                                      r∼ =     r ( ,j t   stim1,end  )     j
activities are clearly different from the original FTV distributions.
                                                                                                                                    where r(j,t) is the vector of network activities at trial j and time t during task A.
Varying hyperparameters of neural networks. In Fig. 3, we trained networks with                                                               For each set of tasks, we performed principal component analysis to get the
the following possible hyperparameters. The activation functions f(⋅) can be the                                                    lower dimensional representation. We repeated this process for different networks.
Softplus function                                                                                                                   The representations of each set of tasks are close to four vertices of a square.
                                  f  ( )x   = log(1 + exp( ))x                                                                      As a result, the top two principal components have similar eigenvalues and are
                                                                                                                                    therefore interchangeable. To better compare across networks in Fig. 6b–e, we
the ReLU                                                                                                                            allowed a rotation and a reflection in the space spanned by the top two PCs. For
                                                                                                                                    each network, the rPCs are chosen such that the Go/Ctx Dly DM 1/DMS task
                                        f   ( )x   = max( , 0)x                                                                     representation lies on the positive part of the x axis, and the Dly Go/Ctx DM
                                                                                                                                    1/DNMS task lies below the x axis. The rPCs are still principal components.
the Tanh function                                                                                                                   Training based on pre-trained networks. In Fig. 7d,e, we pre-trained networks on
                                                                                          ex−e    −x                                one of the following two sets of tasks. Set A includes Go, Dly Go and Anti, while
                               f  ( )x                                     = tanh( )x  =  ex + e−x                                  set B includes Ctx DM 1, Ctx DM 2, Ctx Dly DM 2. We pre-trained 20 networks for
                                                                                                                                    each set. Each network contains 128 ReLU units. Other hyperparameters are the
and the ReTanh                                                                                                                      same as the reference setting. After pre-training, all networks reached at least 97%
                                                                                                                                    accuracy on the trained set of tasks.
                                  f  ( )x   = max(tanh( ), 0)x                                                                                Following pre-training, we trained these networks on either the Dly Anti
                                                                                                                                    task or the Ctx Dly DM 1 task. In Fig. 7d, all connection weights and biased are
 The network architecture can be the leaky RNN architecture defined above,                                                          trained. In Fig. 7e, only the connection weights from rule input units to recurrent
or the leaky GRU architecture⁴². The leaky GRU architecture is modified on the                                                      units are trained.
basis of the original GRU architecture such that the network can be considered as a
discretized version of a time-continuous system.                                                                                    Sequential training and continual learning. For Fig. 8, tasks appear sequentially.
                                                                                                                                    Each task is trained for 400,000 trials. To eliminate bias toward one modality, DM
            λt   =   sigmoid(Wrec,λrt−1 + W in,λut + bλ)                                                                            1 and DM 2 are still trained together and interleaved, and so are Ctx DM 1 and Ctx
            γt   =   sigmoid(Wrec,γrt−1 + W in,γut + bγ)                                                                            DM 2.Connection weights of networks are all initialized with the random orthogonal
            rt   =   (1−αλt) ⊙ rt−1 + αλ                                                                                            initialization described previously. We added a regularizer that protects old tasks
                                                                  t                                                                 by setting another penalty for deviations of important synaptic weights (or other
                     ⋅ f                           (Wrec(γt ⊙ rt−1) + W inut + b +                             2α−1σrec2 N(0, 1))   parameters)³⁵. When training the μth task, the regularizer is

Here, α = Δₜ/τ and τ/λₜ are the effective time constants of each unit. γₜ are the gating                                                              Lcont = cont ∑ Ωkμ(θk−θ∼k)2
variables, determining the extent of which the activity of an unit is used to update                                                                                     k
the activity of other units.                                                                                                                                                              denotes the kth parameter of
 The recurrent connection matrix Wrec is initialized either with a diagonal                                                         Here, cont is the overall strength of the regularizer,θ∼θis the value ofₖ  θₖ at the end of the
matrix (a scaled identity matrix) or with a random orthogonal matrix. The                                                           the network. The value of the anchor parameter   k
Nrec ×Nrec random orthogonal matrix is sampled from O(Nrec), the orthogonal                                                         last task (theμth task). No regularizer is used when training the first task. Also Ωμ
                                                                                                                                                                                                                     k
group in dimension Nrec using the Python function scipy.stats.ortho_group.                                                          measures how important the parameter is. Notice that two recent proposals34,35 for
 We considered L1 regularizations on rates and weights, respectively. The L1                                                        continual learning both use regularizers of this form. The two proposals differ only
regularization on rates is                                                                                                          in how the synaptic importances are computed. We chose the method of Zenke et
                                                                                                                                    al.  , because the method by Kirkpatrick et al.34 measures the synaptic importance
                                                                                                                                    35

                               L            = β
                         L1,rate                   L1,rate N1                              ∑ ∣ri t, ∣                               locally in the parameter space, resulting in underestimated and inaccurate synaptic
                                                       rec                                   i t,                                   importance values for our settings. In Zenke et al., the importance of one parameter
                                                                                                                                    is determined using this parameter’s historic contribution to the change in the loss
 We used βL1,rate = 0,10−5,10−4,10−3. The L1 regularization on weights is                                                           function. For the kth parameter, the contribution to the change in loss during task μ is
                         LL1,weight = βL1,weight ∑η                                           N1η    ∑i j, ∣Wi jη, ∣                                  ωkμ = t=∑ttμμ−1    gk (θ ( ))t  Δθk( )t



NaTuRe NeuRoScieNce | www.nature.com/natureneuroscience

Articles                                                                                                          NaTure NeuroscieNce
where∂∂θL∣    gk(θ(t)) is the gradient of loss with respect to θₖ evaluated at θₖ(t), that is,                noisy the task variance estimates are by computing the task variance on the same
              , and Δ     t        t. Therefore, ω
k     θk( )t      θₖθ(ₖ) is the parameter change taken at step  kμ tracks                                     data where the trial identities are shuffled. If there is little noise, then the task
how parameter     contributes to changes in the loss during the μth task (from tμ−1                           variance on the shuffled data should be close to zero.
to tμ). The final synaptic importance is computed by first normalizing ω ₖμ with the
total change in the synaptic weightν  .    Δ =kμ θk (t μ)−θk(t μ−1) and summing ω ν  for all                  Statistics and study design. In all boxplots, the confidence interval over the
tasks         <                       μ                                           k                           median is obtained with bootstrapping 10,000 times. No assumption was made
                                                                                                              about the data distribution.
                  Ω =kμ                                                 ∑     νωkν                            No statistical methods were used to pre-determine sample sizes but our sample
                                                                       ν<μ (Δk )2 + ξ                         sizes are larger than those reported in previous publications17,18. Independently
                                                                                                              trained networks all have different random seeds for network initialization and
                                       The extra hyperparameter ξ prevents Ωₖμ from becoming too large. The   training samples. Networks with different hyperparameters are trained using the
hyperparameters c= 1.0 and ξ = 0.01 are determined by a coarse grid search.                                   same random seed. Data collection and analysis were not performed blind to the
The final loss is the sum of the squared-error loss and the continual-learning                                conditions of the experiments. As mentioned above, In Figs. 2 and 4, we exclude
regularizer.                                                                                                  units with summed task variance across tasks lower than a threshold, 10−3. Units
                                                                                                              with low task variance are mainly driven by injected noise, and therefore are
                  L = Lmse + Lcont                                                                            irrelevant for our study. In Fig. 8, we exclude networks that achieved less than 80%
                                                                                                              accuracy on Ctx DM 1 and 2, because we are interested in networks that are able
    Even with the help of the continual-learning technique, we had difficulties                               to perform selective integration in Ctx DM 1 and 2. A network can reach 75%
training the network using our original task setups. So we made the DM tasks                                  accuracy even if it completely ignores the context and integrates from the two
easier by increasing the coherences by 10 times. In addition, we used the rectified                           modalities equally. See the Life Sciences Reporting Summary for more information
linear function as the neuronal nonlinearity, namely f(x)= max(x,0). We found that                            on the study design.
networks using rectified linear units learned context-dependent tasks (Ctx DM 1,                              Reporting Summary. Further information on research design is available in the
Ctx DM 2) more easily.                                                                                        Nature Research Reporting Summary linked to this article.
Experimental data analysis. We analyzed data from two monkeys performing
context-dependent DM tasks¹¹. We focused on neural activities from the stimulus                               code availability
presentation period. Before computing the task variance using the same method                                 All training and analysis codes are available on GitHub (https://github.com/
described above, we first computed the trial-averaged firing rate of each unit                                gyyang/multitask).
in each task condition. For each unit, the firing rate in each trial is obtained by
convolving the spikes with a Gaussian kernel of 40 ms width. For each task, we                                Data availability
define four task conditions based on the signs of the motion and color coherence:                             We provide data files in Python and MATLAB readable formats for all trained
(positive motion, positive color), (positive motion, negative color), (negative                               models for further analyses on Github (https://github.com/gyyang/multitask).
motion, positive color), (negative motion, negative color). Then we averaged the
firing rate across all trials in each condition. This leaves us with four firing rate
traces for each unit in each task. Then we computed the task variance for each unit                           References
in each task by calculating the variance across task conditions at every time point,                          43. Kingma, D. & Ba, J. Adam: A method for stochastic optimization. ICLR (2015)..
then averaging across time.                                                                                   44. Le, Q. V., Jaitly, N. & Hinton, G. E. A simple way to initialize recurrent
    It was necessary to reduce the number of task conditions to 4 from the original                           networks of rectified linear units. Preprint at arXiv https://arxiv.org/
36, otherwise the task variance estimates would be too noisy. We assessed how                                 abs/1504.00941 (2015).










                                                                                                              NaTuRe NeuRoScieNce | www.nature.com/natureneuroscience
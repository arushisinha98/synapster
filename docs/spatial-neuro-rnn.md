    nature machine intelligence



Artice https://doi.org/10.1038/s42256-023-00748-9
Spatially embedded recurrent neural
networks reveal widespread links between
structural and functional neuroscience
findings





Received: 12 January 2023 Jascha Achterberg   1,5  , Danyal Akarca   1,5  , D. J. Strouse², John Duncan1,3,6 &
Accepted: 26 September 2023 Duncan E. Astle   1,4,6
Published online: 20 November 2023 Brain networks exist within the confines of resource limitations. As a result, a
   Check for updates brain network must overcome the metabolic costs of growing and sustaining
        the network within its physical space, while simultaneously implementing
        its required information processing. Here, to observe the effect of these
        processes, we introduce the spatially embedded recurrent neural network
        (seRNN). seRNNs learn basic task-related inferences while existing
        within a three-dimensional Euclidean space, where the communication
        of constituent neurons is constrained by a sparse connectome. We find
        that seRNNs converge on structural and functional features that are also
        commonly found in primate cerebral cortices. Specifically, they converge
        on solving inferences using modular small-world networks, in which
        functionally similar units spatially configure themselves to utilize an
        energetically efficient mixed-selective code. Because these features
        emerge in unison, seRNNs reveal how many common structural and
        functional brain motifs are strongly intertwined and can be attributed to
        basic biological optimization processes. seRNNs incorporate biophysical
        constraints within a fully artificial system and can serve as a bridge between
        structural and functional research communities to move neuroscientific
        understanding forwards.


As they develop, brain networks learn to achieve objectives, from simple physical space, while simultaneously optimizing that network for infor-
functions such as autonomic regulation, to higher-order processes mation processing. This trade-off shapes all brains within and across
such as solving problems. Many stereotypical features of networks are species, meaning it could be why many brains converge on similar
downstream consequences of resolving challenges and trade-offs they organizational solutions⁴. As such, the most basic features of both brain
face, across their lifetime1,2 and evolution3–5. One example is the optimi- organization and network function—such as its sparse and small-world
zation of functionality within resource constraints; all brain networks structure, functional modularity, and characteristic neuronal tuning
must overcome metabolic costs to grow and sustain the network in curves—might arise because of this basic optimization problem.


1MRC Cognition and Brain Sciences Unit, University of Cambridge, Cambridge, UK. 2Google DeepMind, London, UK. 3Department of Experimental
Psychology, University of Oxford, Oxford, UK. ⁴Department of Psychiatry, University of Cambridge, Cambridge, UK. ⁵These authors
contributed equally: Jascha Achterberg, Danyal Akarca. ⁶These authors jointly supervised this work: John Duncan, Duncan E. Astle.
   e-mail: jascha.achterberg@mrc-cbu.cam.ac.uk; danyal.akarca@mrc-cbu.cam.ac.uk

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1369

        Artice                                                                                                                                                                                    https://doi.org/10.1038/s42256-023-00748-9

     a             Fully connected                                                                                                                                                       Sparse

                                                                                                                                                                                         Oo        Regularization
                                                                                                                                                                                                                    strength, λ

                       None                                Low                                                                                                                            High

     b                                                           Embedding in a Euclidean (D) space                                                                            d              Euclidean space
           RNN         ™                               (5,10,9)                                                     D                                          High                           Short                     Long
                                                          4                                      1
                                                           6.4                                   2

                                                                                                                                                                                              connections                      connections
          Distance-dependent          12.42            3                            (9,6,6)5    43                                                                                        Core             Short core    Long core
          connectivity between                                                                   5
          network nodes                     1          (2,1,1)                         6         6   1    2      3       4   5                      6           Low
                                      D = Euclidean                                                          Neuron

     c                                                          Embedding in a topological (C) space                                                                                    Peripheral      Short peripheral     Long peripheral
                                                                                                                                                                                                          connections          connections
           RNN                                                                                                      C                                   High
                           |G               2                 34                           5  4321                                                                                            JV                                  Strengthen
                                                                                                                                                                                                                        Stable
          Local communication                                                                    5                                                                                                                                    Weaken
          between nodes across                                                         6         6
          the network’s topology            1                                                        1    2      3       4   5                      6       Low                               —
                                                                       C = (es–1/2ws–1/2)i,j                 Neuron                                                                           —
     e             1,000 trained baseline RNNs                                                                                    task    Loss = Loss                               f                          ®    Start
                       L1 regularization (varied λ)                                                                    + λ|ΙW O   O
                                      yt                                                               W                                         D D    CΙ|           C                       One-step         ©    Current goal direction
                                                                                                                                                                                          inference task       ©    Possible goal directions
                                      0                                                          1                  1                                   1                                                      ©    Current choice options
                                      0                                      Loss = Losstask     2                  2                                   2
          1                                                                     + λ| W |        43                  3                                   3
                                                                                 Ι Ι                                4                                   4                                 Goal               Choice
          0                           01                                                        65                  5                                   5
          0                                                                                        1 2 3  4  5 6    6    1 2 3 4                  5 6   6    1  2 3   4    5 6      presentation          presentation                  yt
     x    0            ~]             y                                                        321                  321                                 1
        t 1                                                                                                                                             2                                                                               Up
                                                                                                                                                        3
          0   Nie.                    0t                                                       645                  45                                  4
                                                                                                                                                        5                                        — Delay  —                             Down
          1            Nall                            Loss                         Loss                            6                                   6                                                               Left
          0                           0                       =                         task       1 2 3  4  5 6         1 2 3 4                  5 6        1  2 3   4    5 6                                                         Right
         y        z                   01                                  + λ|ΙW O D O CΙ|      21                  1                                   1
                                                                                                                    2                                   2
                                                                                                 3                  3                                   3
              x                                                                                  4                  4                                   4                               20 steps   10 steps 20 steps      Decision
                                                                                                 5                  5                                   5
                       1,000 trained seRNNs                                                      6 1 2 3  4  5 6    6    1 2 3 4                  5 6   6    1  2 3   4    5 6                50 steps per trial                     point
         Euclidean and topological regularization (varied λ)                                                        Comparison with data
    Fig. 1 | Task structure and seRNNs. a, We use regularization to influence                                                     unit-wide fully connected feed-forward layer and represents its choice as one of
    network structure during training to promote smaller network weights and                                                      four choice units in the output layer. We compare these with 1,000 seRNNs,
    hence a sparser connectome. b, Through regularization, we embed RNNs in                                                       which include both Euclidean and topological constraints in their regularization
    Euclidean space by assigning units a location on an even 5 × 5 × 4 grid. We show                                              term, by multiplying the weight matrix (W) by its Euclidean distance (D) and
    a schematic of a six-node network in its space. c, We similarly embed RNNs in a                                               weighted communicability (C). Elements of the resulting matrix are summed,
    topological space, guiding the pruning process towards efficient intra-network                                                forming the structural loss. We minimize the sum of the task loss and the
    communication operationalized by a weighted communicability measure (see                                                      structural loss. To the right, we show the evolution of W, D and C matrices over
    main text). The weighted communicability term is shown for the same network.                                                  training. f, Networks solve a one-step inference task starting with a period of
    d, When these constraints are placed within a joint regularization term, networks                                             twenty steps where the goal is presented in one of four locations on a grid: top/
    are incentivized to strengthen short connections, which are core to the networks                                              bottom, left/right (depicted in light blue). Subsequently, there is a ten-step
    topological structure, and weaken long connections, which are peripheral.                                                     delay where the goal location must be memorized. Then two choice options are
    Networks are generally incentivized to weaken connections while optimizing                                                    provided for twenty steps. Using prior goal information, agents must choose the
    task performance. e, In the main study, we trained 1,000 L1-regularized RNNs as a                                             option closer to the goal. In this example, given left and right options, the correct
    baseline. L1 networks optimize task performance while minimizing the strength                                                 decision is to select right.
    of their absolute weights (W). The network receives task inputs from an eight-




     Our understanding of how the brain’s structure and function behaviour emerge in the first place? To address this question, we need
interact largely comes from observing differences in brain structure, to be able to manipulate experimentally how neural networks form, as
such as across individuals⁶ or following brain injury⁷, and then system- they learn to achieve behavioural objectives, to establish the causality
atically linking these differences to brain function or behavioural out- of these relationships. Computational models allow us to do this⁸. They
comes. But how do these relationships between structure, function and have shown that network modularity can arise through the spatial cost

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1370










Training time/epoch    Neuron                          Neuron










                                                       Topological space










                                                       Euclidean                                          Communicability

       Artice                                                                                                               https://doi.org/10.1038/s42256-023-00748-9

    a 100                                 b 800               c                                 0                           d      295                                           seRNN
                                                                                                                                                                                 L1
       90                                   600                                              –0.1                                  290                                            ∑ W
       80                                   400                                              –0.2                                  285                                           800
                                                                                                                                   280
       70                                            a                                       –0.3        yy                        275                                           400
       60                                   200      .                                       –0.4                                  270            PY  a                          200
       50                                     0                                              –0.5                                  265                                           2 s.e.
            0        2 4 6   8     10          0   2 4    6 8     10                                 0   2 4   6         8     10      0  2   4   6   8   10
                 Training time/epoch           Training time/epoch                                      Training time/epoch            Training time/epoch

    e
                                                                                                                                                                            Maximum
                                               ]                                            i                           r = –0.423
                         =   0        ov         Os sa    Weighted                                                      P < 10–6
                       0TAG           © og                edge                                             2s:
                       »                   25                                                                           ;
                                           ©
        y      x z                    y                                                     :              Euclidean                          Neuron                        Minimum
    Fig. 2 | Validating the training of seRNNs.a , The validation accuracy of all                    networks to prefer topologically central weights over topologically peripheral
    converging neural networks is shown across L1 RNNs (n = 479, blue, for all plots)                weights, as shown by lower weighted communicability values. e, Left: an example
    and seRNNs (n = 390, pink, for all plots), showing that equivalent performance                   of a representative seRNN network in the 3D space in which it was trained. The
    is achieved on the one-step inference task. For all plots, error bars correspond                 size of the nodes reflects their node strength. This network was taken from
    to two standard errors. b, At the same time, both groups of networks show a                      epoch 9 at a regularization of 0.08 and is the network used for visualizations for
    general trend of weakening the weights in their recurrent layer, showing that the                the rest of this paper. Middle: we show the negative relationship between the
    overall regularization is working in both groups of networks. c, As a result of their            connection weights of seRNN versus the Euclidean distances of the connections.
    unique regularization function, seRNNs have a negative correlation between                       Pearson’s correlation coefficient is provided, with the corresponding P value
    weight and Euclidean distance over the course of epochs/training, but in L1                      (P = 7.03 × 10−7). No adjustments were required for multiple comparisons. Right:
    networks there is no relationship between weights and Euclidean distance. d, The                 we show the weight matrix of this seRNN, showing how weights are patterned
    regularization function of seRNNs also successfully influences the topology of                   throughout the network.



of growing a network⁹, how orthogonal population dynamics can arise In regularization, instead of merely optimizing a network’s weights
purely through optimizing task performance¹⁰ and how predictive cod- to maximize task performance, one adds an additional regularization
ing can arise through limiting a brain’s energy usage¹¹. But we have yet term to the optimizer to minimize the strength of a network’s weights.
to incorporate both the brain’s anatomy and the brain’s function into a This is related to regularized regression, such as L1 (LASSO) regression,
single coherent model, allowing a network to dynamically trade-off its where the sum of the absolute beta weights is minimized to improve a
different structural, functional and behavioural objectives in real time. model’s out-of-sample prediction performance. We use the same idea
     To achieve this, we introduce spatially embedded recurrent neural to spatially embed an RNN. We start with fully connected RNNs and
networks (seRNNs). An seRNN is optimized to solve a task, making while they are trained to maximize task performance, we nudge them
decisions to achieve functional goals. However, as it learns to achieve to minimize weights that are long in 3D space. To achieve this, we assign
these goals and to optimize its behavioural performance, its constitu- every unit in the RNN’s recurrent layer a location in 3D space (Fig. 1b)
ent neurons face the kind of resource constraints experienced within and regularize a weight more strongly if it belongs to two units that
biological networks. Neurons must balance their finite resources to are far apart in Euclidean space. In this pruning process, we also want
grow or prune connections, while the cost of a connection is propor- the network to optimize within-network communication, meaning a
tional to its length in three-dimensional (3D) Euclidean space12–16. At weight should be more readily pruned if it does not contribute strongly
the same time, the network attempts to optimize its intra-network to the propagation of signals within the network. A standard measure
communication to allow for efficient propagation of signals 17–21. By of signal propagation in a (binary) network is communicability, reflect-
allowing seRNNs to dynamically manage both their structural and func- ing the shortest routes between all pairs of nodes²² (Fig. 1c; see details
tional objectives simultaneously, while they learn to behave, multiple in ‘Communicability’ in Supplementary Information). When adapted
simple and complex hallmarks of biological brains naturally emerge. for a weighted network (weighted communicability¹⁹), the commu-
        nicability value of a network is low when there are strong global core
Results connections supporting short paths across the network while avoid-
Spatially embedded recurrent neural networks ing redundant peripheral connections to achieve sparsity (Fig. 1d). In
Our first goal was to create a supervised optimization process that sub- Supplementary Information (‘Minimizing redundant connectivity by
jects recurrent neural networks (RNNs; ‘RNN modelling’ in Methods) to minimizing weighted communicability’), we provide information on
the constraints of biophysical space while they are optimized for task per- how weighted communicability differentially optimizes peripheral
formance. An established way of influencing a network’s weight matrix and core connection strengths. By combining the spatial distance and
while it is optimized for task performance is regularization (Fig. 1a).  weighted communicability terms in an RNN’s regularization while it

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1371










                       Validation accuracy (%)










                       Total weight, W










Weight                 Corr(Weight,Euclidean)








Neuron                 Communicability, C










                                                          Weight

    Artice                                                                                                                                                   https://doi.org/10.1038/s42256-023-00748-9

    a  Modularity                                                                                 b         Small-worldness
       Quality of  0.4                                                                                                                                                                     seRNN
       separable                                                             P = 2.24 × 10–82                        High clustering           2.5      aa
                                                                            Cohen’s d  = 1.07                     Low path lengths                                           Cohen’s d  = 0.59
       partitions  0.3                                                                                                                             ¥    5                     P = 2.82 × 10–19
                                                             150                                                                               2.0                      a 120                L1
                                                                                                                                                                          100
                   0.2                                       100                                            4                                  1.5                         80           ΣW
                                                                                                                                                                           60               800
        AN         0.1                                        50                                                                                                           40
                                                                                                                                                                           20               400
                     0    2    4        6    8 10              0    0    0.2       0.40.60.8                A                                  1.0                          0    1 2 3  4 5 200
                                                                              Modularity, Q                                                        2  4 6 8   10             Small-worldness, σ 2 s.e.
                           Training time/epoch                                                                                                 Training time/epoch

    c                                          0.8                                                ANOVA P*P        < 10–3 –90    Generative models            Macroscopic               Microscopic
                                                                                                             < 10                1. Spatial        diffusion imaging                  neuronal networks
                                                                                                                                 2. Neighbours
                                                                                                                                 3. Matching
                          .                    0.6                                       [=]                                     4. C average
                                                                                                                                 5. C minimum
                            [A                 0.4                  *                                                            6. C maximum          0.6                         0.6
                                                                                                                                 7. C difference                  a
                                        A                                           2           =                                8. C product          0.4                         0.4
                                               0.2                                                                               9. D average      4
                                                                                                                                 10. D minimum         0.2                         0.2  78
                                                                                                                                 11. D maximum
                     ©                                                                                                           12. D difference
        ba                 Generative model      0    1     2           3   4       5 6     7   8  9        10    11     12 13   13. D product      0                                0
                           of network
                           formation                                        Generative model
                                            Spatial                                Homophily    Clustering        Degree

    Fig. 3 | seRNNs show a brain-like structural topology.a , Left: a schematic                                  A two-sample t-test was taken to provide the P value. No adjustments were
    illustration of the concept of modularity in networks. While both L1 (n = 479) and                           required for multiple comparisons. c, For a range of generative network models
    seRNN (n = 390) networks show increasing modularity over epochs/training,                                    (‘Generative network modelling’ in Methods), we present the model fit of the
    there is a consistently greater modularity in seRNNs compared with L1 networks.                              top performing simulations fit to seRNNs (n = 390). Note that the lower the
    Error bars correspond to two standard errors. Right: we show very large (Cohen’s                             model fit, the better the performance, as the model fit function is a measure of
    d = 1.07) statistical differences in modularity distributions for functioning                                dissimilarity between the RNN and the generative simulation. The results show
    (validation accuracy ≥90%) epoch 9 networks in L1 and seRNN networks. A two-                                 that homophily models achieve the best model fits. These findings are congruent
    sample t-test was taken to provide the P value. No adjustments were required for                             with published data from adolescent whole-brain diffusion-MRI structural
    multiple comparisons. b, Left: a schematic illustration of the concept of small-                             connectomes³⁵ (middle right) and high-density functional neuronal networks
    worldness in networks. While both L1 (n = 479) and seRNN (n = 390) networks                                  at single-cell resolution¹⁵ (right). The boxplots present the minimum value
    show a similar trajectory shape of small-worldness over epochs/training, there                               (bottom), maximum value (top), median value (centre) and the interquartile
    is a consistently greater small-worldness in seRNNs compared with L1 networks.                               range (bounded 25th and 75th percentile). A one-way ANOVA was taken to
    Error bars correspond to two standard errors. Right: we show moderate-to-large                               provide the first P value (P = 1.04 × 10−91), followed by a Tukey’s test for pairwise
    (Cohen’s d = 0.59) statistical differences in small-worldness distributions for                              comparisons in which homophily models had a pairwise P value <10−3 for all
    functioning epoch 9 networks in L1 and seRNN networks.                                                       comparisons.




learns to solve a task, we arrive at seRNNs (Fig. 1e). We provide a detailed for seRNNs, n = 479 for L1s; see ‘Regularization strength set-up and
walkthrough of the regularization function in ‘seRNN regularization network selection’ in Methods for discussion of network numbers),
function’ in Methods. While learning to solve a task, seRNNs are nudged we first validated that our optimization process is working. By using
to prefer short core weights over long peripheral weights. L1 networks as a baseline, we observed that both groups decrease in
     To understand how this spatial embedding impacts a network’s their average connectivity strength (Fig. 2b) but that only seRNNs did
structure and function, we set up 2,000 RNNs. Half of the networks so by pruning long-distance connections (Fig. 2c). This is commonly
were seRNNs trained with the new optimization process described found in empirical brain networks across species and scales²³. In addi-
above. The other half were regular RNNs regularized with a standard tion, we validate that seRNNs successfully focus their pruning process
L1 regularizer minimizing the sum of the absolute weights, to arrive at on weights that are less important for the network’s communicative
a population of baseline networks that match seRNNs in overall con- structure, as represented by lower weighted communicability (Fig. 2d).
nectivity strength. In both cases, the regularizer was applied to the Figure 2e shows an example visualization of one seRNN.
hidden recurrent layer of the network and the regularization strength Having shown that the new regularization function in seRNNs has
was systematically varied within each subgroup of networks to cover the expected effects on the weight matrix of networks, we next tested
a wide spectrum of regularization strength that is matched across which features result from the spatial embedding. Specifically, we
subgroups (Fig. 1e and ‘Regularization strength set-up and network tested whether seRNNs show features commonly observed in primate
selection’ in Methods). All networks had 100 units in their hidden cerebral cortices, including structural motifs such as modularity24–26
layer and were trained for 10 epochs. All networks started strongly and small-worldness27,28, before testing for functional clustering of
connected and learned through pruning weights in accordance with units in space27,28. We then go beyond structural and functional organi-
their regularization. We trained networks on a one-choice inference zation and test whether spatial embedding forces networks to imple-
task that required networks to develop two fundamental cognitive ment an energy-efficient mixed-selective code29,30. In short, we wanted
functions of recurrent networks: remembering task information (‘goal’) to test whether established organization properties of complex brain
and integrating it with new incoming information (‘choices’) (Fig. 1f  networks arise when we impose local biophysical constraints.
and ‘Task paradigm’ in Methods).
     When training the networks, we found that both types of network Modular small-world networks emerge from constraints
manage to learn the task with high accuracy (Fig. 2a). Focusing on We first investigated two key topological characteristics that are
networks that successfully solve the task (>90% task accuracy; n = 390 commonly found in empirical brain networks across spatial scales

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1372










    Modularity, Q










    Model fit

        Frequency










    Small-worldness, σ




Model fit






        Frequency


Model fit










                                                                                                                                               ClusteringDegree   Spatial ClusteringDegree
    Homophily                                                                                                                                                     Homophily
    Spatial

Artice https://doi.org/10.1038/s42256-023-00748-9

and proposed to facilitate brain function: modularity 24–26 and in Methods). In Fig. 4d, we show a visualization in a representative
small-worldness27,28. Modularity denotes dense intrinsic connectiv- network and unit-specific preferences over the course of a single trial.
ity within a module but sparse weak extrinsic connections between By taking the relative preference for goal versus choice for each
modules and small-worldness indicates a short average path length unit, we tested whether the relative sensitivity to stimuli was con -
between all node pairs, with high local clustering. centrated in parts of the network. We used a spatial permutation test
     Computing modularity Q statistics and small-worldness (‘Topo - (‘Spatial permutation test’ in Methods) to test whether the Euclidean
logical analysis’ in Methods) shows that seRNNs consistently show both distance between highly ‘goal’ or ‘choice’ selective neurons was sig -
increased modularity (Fig. 3a) and small-worldness (Fig. 3b) relative to nificantly less or more than would be expected by chance. A small
L1 networks over the course of training. Differences are smaller initially, Pₚₑᵣₘ value highlights that functionally similar neurons tend to be
but later in training, the effect size for differences in modularity are significantly clustered in space whereas a large P perm corresponds to
large (at epoch 9, modularity P = 2.24 × 10−82, Cohen’s d = 1.07; Fig. 3a,  functionally similar neurons being distributed in space (Fig. 4e, top).
right) and for small-worldness moderate to large (P  = 2.82 × 10−19, We tested for functional co-localization across three time windows
Cohen’s d = 0.59; Fig. 3b, right). seRNNs achieve modularity Q statistics of the trial (the total duration of a trial was 50 steps; Fig. 1e): (1) early
within ranges commonly found in empirical human cortical networks³¹. stage (goal presented, steps 15–20); (2) middle stage (choice options
Both L1 and seRNNs achieve the technical definition of small-worldness presented, steps 30–35) and (3) late stage (decision point, steps 45–50).
of >1 (ref. 32), but seRNNs show a higher value more consistent with At the early stage, when only goal information is presented, neurons
empirical networks³³. ‘Replication across architectures’ in Supple- code for only the goal information (widespread dark green nodes in
mentary Information shows how the subparts of the regularization Fig. 4d, left). In seRNNs, there is a slight positive skew in P perm values,
interact with the task optimization to shape these structural effects. suggesting clustering of highly goal-coding neurons (Fig. 4e, mid -
It is important to note that within the population of seRNNs, we find dle left). Subsequently, in the middle stage, when choice options are
varying degrees of modularity and small-worldness (Fig. 3a, right, and first shown, goal information clusters within a concentrated area of
Fig. 3b, right). We will return to this variability in a later section. space, leaving the choice information distributed (seen by clustering
     To further validate the structural likeness of seRNNs to empiri - of green nodes and distribution of brown nodes in Fig. 4d, middle).
cal neural connectivity, we used generative network models 9,34–36. This is highlighted by a large positive skew in Pₚₑᵣₘ values for the goal in
These models elucidate which topological wiring rules can accurately seRNN networks (Fig. 4e, middle top) and correspondingly the oppo-
approximate observed neural graphs. Corroborating empirical macro- site for choice information (Fig. 4e, middle bottom). In the late stage,
and microscopic data15,35, we find that homophily wiring rules—where the clustering of goal information in space dissipates such that by the
neurons preferentially form connections to other neurons that are time a decision must be made, the goal information has now spread
self-similar in their connectivity profiles—perform best in approximat- out more but still retains some clustering (Fig. 4e, middle right). The
ing the topology of seRNNs relative to all other wiring rules (Fig. 3c   choice code remains distributed (Fig. 4e, bottom right). This suggests
and additional detail in ‘Generative network modelling of RNNs’ in that seRNNs use their highly modular structure to keep a connected
Supplementary Information). core with goal information, which needs to be retained across the trial.
        It uses spatially proximal units to form this core. The presented choices
Functionally related units spatially organize in seRNNs information is then represented by units outside this core and dynami-
So far, we have explored how imposing biophysical constraints within cally integrates with the information in the core as the decision point
seRNNs produces structures that mimic observed networks. However, approaches. These findings are unique to seRNNs, as L1 P perm values
this ignores the functional roles of neurons or their patterning within remain uniform, indicative of no functional organization. The control
the network. We next examined this by exploring the configuration of analysis in Supplementary Fig. 12 shows these findings hold true when
functionally related neurons in 3D space (Fig. 4a). In brain networks, variables are treated independently instead of relatively.
neurons sharing a tuning profile to a stimulus tend to spatially group37,38.
This can be observed on fine-grained cortical surfaces with prefer- Mixed selectivity and energy-efficient coding
ences for stimuli features³⁹ (Fig. 4b) and in whole-brain functional So far, we have shown that adding spatial constraints to a network gives
connectivity forming modular network patterns⁴⁰ (Fig. 4c). In addi- rise to patterns of network connectivity that are highly reminiscent of
tion, high-resolution recordings in rodents show how the brain keeps observed biological networks. Nodes functionally co-localize and the
many codes localized but also distributes some across the network⁴¹. spatial embedding causes differences in how they code task-relevant
To test whether seRNNs recapitulate functional co-localization, we information. This selectivity profile has been widely studied. Studies
decoded how much variance of unit activity can be explained by the show that neurons in task-positive brain regions tend to show a mixed
goal location or choice options, over the course of each trial (‘Decoding’ selectivity profile, meaning that neurons do not only code for a single

Fig. 4 | Functional clustering and distribution of coding in space.a , An was equivalent to chance, for each statistic we computed a null distribution
example of a representative seRNN network. The colour of the nodes relates  of expected distances between goal and choice units, respectively, under the
to the decoding preference of that neuron, where a preference for goal assumption that they are randomly located in space. This was calculated by
information is represented by green and choices information by brown.  taking 1,000 random samples of the same size as the number of empirical
b, The spatial clustering of neuronal ensembles that are preferentially tuned neurons with a preference for goal or choice information. The Pₚₑᵣₘ relates to
for orientation versus colour in human prefrontal cortex. The Dorsal-Ventral where the statistic sits within this null distribution, where each network gets a
(D-V) and Anterior-Posterior (A-P) axes are shown³⁹. c, The macroscopic spatial Pₚₑᵣₘ for goal and choice information. The skew of the Pₚₑᵣₘ towards zero shows
organization of functional networks⁴⁰. d, We show decoding of units for goal that the code of networks is more clustered than the null distribution whereas
(green) versus choice (brown) information at different points in the trial, a skew towards one highlights a more distributed code. The Pₚₑᵣₘ values across
within the representative seRNN network. e, A schematic illustration of the RNNs are given for goal information (middle) and choice information (bottom)
spatial permutation test for determining whether the neurons are functionally for seRNNs (pink) and L1 networks (blue). Goal information is shown to be
clustered (top left) or distributed (top right) in space. For this permutation test, clustered, as given by the positively skewed Pₚₑᵣₘ distributions. In contrast,
we compute the summed Euclidean distance between units with an observed choice information is shown to be distributed. No adjustments were required
preference for goal or choice information, respectively, weighted by the for multiple comparisons. Panel b reproduced with permission from ref. 39,
magnitude of their preference (termed cluster ∑ weighted Euclidean). This gives under a Creative Commons licence CC BY 4.0. Panel c adapted with permission
a statistic, for every network, corresponding to the weighted distance between from ref. 40, Elsevier.
units (that is, goal or choice units) in space. To determine whether this statistic

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1373

    Artice    https://doi.org/10.1038/s42256-023-00748-9




    a                    b                           c

         oq © LJ
         Ye                   = fr,   ~~
             Ne          P    D    A Nese:  od
         eo    ®   Te         V                      [CJ Fronto-parietal network
                                                     [Hl Dorsal attention network
                         Orientation      Colour     Hl Cingulo-opercular network
                                                      Default mode network



    d    H                    HH
   Goal                       Choice options    Decision
presented                     presented        point
                         Delay
                              ee °


  Early  Middle  Late
  Steps 15–20  Steps 30–35  Steps 45–50
  Peg  .
  °  NY
  8  °°  Q  -.  Goal
  °  ©  ate  4  oA,
  °

  ©ht  8  ©  a
  0  [Pd°
  o  Choices


    e          Observation       1,000 null            Spatial distribution
           Pperm = 0              samples           0     of codingP        1                                   P   = 1
                                               Clustered          perm Distributed                                 perm
               Cluster ∑ Weighted
                         Euclidean
                                                    Spatially clustered goal code                                           seRNN
      Steps 15–20                              Steps 30–35                                 Steps 45–50                      L1
      150              150                     150                  150                    150              150
      100              100                     100                  100                    100              100
       50               50                      50   Positive        50    No effect        50               50
                                                       skew
        0                0                       0                    0                      0                0
           0  0.5    1.0      0  0.5   1.0          0  0.5    1.0     0    0.5        1.0       0  0.5    1.0   0  0.5   1.0
             Pperm              Pperm                 Pperm               Pperm                   Pperm           Pperm

                                               Spatially distributed choices code

      Steps 15–20                              Steps 30–35                                 Steps 45–50
      150              150                     150                  150                    150              150

      100              100                     100                  100                    100              100
       50               50                      50   Negative        50
                                                       skew             No effect           50               50
        0                0                       0                    0                      0                0
           0  0.5    1.0      0  0.5   1.0          0  0.5    1.0     0    0.5        1.0       0  0.5    1.0   0  0.5   1.0
             Pperm              Pperm                 Pperm               Pperm                   Pperm           Pperm





    Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381                                                      1374










Frequency    Frequency










Frequency    Frequency










Frequency    Frequency










    preference
    Decoding

    Artice                                                                                             https://doi.org/10.1038/s42256-023-00748-9

        a  120                       Expected value:                                          b        Sparse    Dense seRNN
           100                       mixed selectivity                                             1.8        L1
            80                                                                                     1.6
            60                                                                                     1.4
                                                                                                   1.2
            40
                                                                                                   1.0
            20                                                                                     0.8

             0                                                                                     0.6
        –1.0     –0.8 –0.6 –0.4 –0.2 0 0.2 0.4     0.6                                    0.8 1.0      20     40 60 80
                        Correlation of selectivities                                                   Relative total network weight (%)
    Fig. 5 | Mixed selectivity and energetic efficiency.a , A histogram of correlations   lines mark the median of the distribution. The expected value corresponds to
    of selectivities at the decision point (correlation between explained variance for    a fully mixed-selective code. b, seRNN (n = 390) networks spend less energy on
    goal and explained variance for choices) shows how the distribution of seRNNs         unit activations than L1 (n = 479) networks, which are matched for mean weight
    is more centred around the expected value r = 0 than the L1 networks. Coloured        strength in the recurrent layer. Error bars correspond to two standard errors.



task variable but instead a mixture of them30,42–44. A mixed-selective Constraints cause linked brain-like structure and function
code is assumed to allow networks to solve complex tasks by increas- So far, we have seen that seRNNs show a collection of features that are
ing the decodability of information from the network’s neurons29,45. commonly observed in brains but have not previously been related.
There are many ways to quantify selectivity profiles 46. One simple The caveat not addressed so far is that for any feature we observed in
method is to calculate the correlation of explained variances of task seRNNs, we also see strong variation across the population of networks
variables across the population of neurons. These are expected to be (for example, Fig. 3b for modularity or Fig. 5a for mixed selectivity).
uncorrelated, implying a neutrally mixed code where a neuron’s cod- This opens the possibility that these features do not arise in parallel in
ing preference for one variable does not predict its code for another seRNNs but instead each feature could emerge in its unique subgroup
variable. In single-unit recordings, correlations can be close to zero or of networks. This would be unlike biological brains, which exist in a
sometimes slightly positive⁴⁷. critical sweet-spot area⁴⁹ where all the features described in this paper
     We looked at the correlation of selectivities of trained networks are observed. In this section, we tested whether all seRNN features
(epoch 9) for the goal and choices variables. At the time in the trial when co-appear in a similar subset of trained networks, defined by a unique
networks make a choice, the median correlation is r = −0.057 for seRNN combination of training parameters.
but r = −0.303 for L1, showing that L1 networks produce an anticor - To study the co-occurrence of brain features in seRNNs, we
related code while seRNNs have a more mixed-selective code (Fig. 5a). looked at the distribution of feature magnitude across the space of
It is possible that this effect is driven by the differential connectome training parameters (regularization strength, number of training
structure of the two groups of networks. While a modular and separated epochs passed). Figure 6a shows matrix plots for accuracy (left),
network would not automatically mix codes across variables evenly, we total sum of weights (middle left), modularity (middle right) and
find a well-mixed code in seRNNs. The additional highly communicative small-worldness (right) across the entire spectrum of training epochs
connections between modules of the small-worldness characteristic (x axis) and regularization strengths (y axis). As before, there is varia-
might help seRNNs to organize units in space while retaining a mixed tion in the magnitude of features across the population of networks,
code across the population. ‘Mixed selectivity’ in Supplementary Infor- but now we also see that this variation is structured. Brain-like topol-
mation shows how networks specifically show a mixed-selective code ogy emerges in a sweet-spot of low to medium strength regulariza-
at the time when the decision is made. Like our structural results, we tion and during the later training epochs (pink box). The schematic
saw that there is variation across the population of networks (Fig. 5a), in Fig. 6b highlights this space of sparse, highly accurate, modular
where some networks fall neatly on r = 0 and others might show corre- small-world networks with an example network showing all proper-
lated codes. The following section provides an analysis of this variance. ties (Fig. 6b, middle right). Above this space (that is, networks with
     The choice of a neuronal code in populations of neurons is strongly less regularization, highlighted in orange) networks can solve the
linked to the question of energy demand. As the firing of action poten- task and show small-worldness, but remain very dense and lack the
tials uses a substantial amount of energy⁴⁸, a population of neurons modular organization found in empirical brain networks. Below
should choose a code with a good trade-off of metabolic cost and infor- this space (that is, networks with more regularization, highlighted
mation capacity²⁹. To test our networks’ energy consumption, we cal- in light blue) networks show extreme sparsity and modularity, but
culated the mean activation of each unit in a network’s recurrent layer fail to functionally converge on the task and they lose their small-
(epoch 9) during the period of information integration (after onset world topology.
of choices). Then we tested for the difference between seRNNs and Next, we wanted to look at the same ‘sweet spot’ in terms of the
L1 networks, controlling for the effect of the average weight strength network’s functional properties. As the decoding required us to focus
in the recurrent layer (Fig. 5b). Across most weight strengths, seRNNs this analysis on networks with high task performance (‘Decoding’
showed significantly lower unit activations compared with L1 networks in Methods), we use networks with an accuracy >90% at epoch 9.
(P < 0.001, t(86,497) = 21.4, 95% confidence interval = [−0.271, −0.226]). Figure 6c shows the functional results across regularization strengths,
Sustaining a mixed-selective code at the time of choice might help highlighting the sweet spot of regularization from Fig. 6a with the
downstream integration units to decode information more easily, with pink box. In the first two plots from the top, we show two structural
fewer unit activations needed to communicate the correct choice. This metrics (sparsity and short connection preference). We observed the
effect disappears for networks with higher average weights, with weak same distribution when looking at the homophily generative wiring
regularization and hence weaker spatial embedding. rule (Supplementary Fig. 11b). Looking at mixed selectivity (Fig. 6c,

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1375










   Frequency










Unit activity

Artice https://doi.org/10.1038/s42256-023-00748-9

 a Accuracy (%) Total weight, ΣW Modularity, Q Small-worldness, σ
 Low % Maximum
        σ






    HighNone Training time/epoch Complete        ∑W                                                              Q                                                 0%
    b    Convergent brain-like properties within                                                                              c 800  Optimal
                                                                                                                               trade-offs
         No      a narrow critical window                                                                                  -    600
    constraints                                                                        Accurate,     1                     ®    400    Sparsity
                                                                                         dense,
                                                                                      non-modular,
                                             1                                        small-world    (Fyᵒ                  ®   2000  doses
                                                                                                                 7 { Ad        –0.1     Short
                                                                                                                                      connection
                                                                                                                               –0.2   preference
                                             2                                                                   2             –0.3  A
                                                                                                             -                 –0.4
                                                 ~                                      Optimal                                –0.5   |
                                                 trade-offs
                                                                                      'sweet spot'   B⁴      br                 1.0     Mixed
                                                                                                                                0.5  selectivity

                                                                                                                                  0
                                             3                                        Inaccurate,                              –0.5
                                                                                        sparse,      he.         ad             1.0    Choices
                                                                                        modular,
                                                                                         world                                                                      +
       Highly                                                                          non-small-            bh                9
    constrained                                                                                      “5          fa             0.5
       No      Training time/epoch                                        Training    y                                                   .
    training                                                              complete                           z                    0     Goal
                                                                                                     x                         0 Regularization (%) 80

    Fig. 6 | The seRNN parameter space converges on brain-like topology and           small-world networks are generated, which we term as being at the optimal
    function. a, The white borders within the regularization-training parameter       trade-off. Networks 1, 2 and 3 each represent example networks across the space.
    space delineate the conditions where seRNNs achieve robust accuracy (left),       The nodes of the representative graph reflect the node’s strength, defined
    sparse connectivity (middle left), modular networks (middle right) and small-     as the total sum of the node’s in- and out-connection weights. c, In this pink
    worldness (right). The pink box shows where all these findings can be found       window, networks are sparse (top), prefer short connections (middle top), have a
    simultaneously. The colour of the matrix corresponds to the relative magnitude    correlations of variable selectivities centring around zero, consistent with mixed
    of the statistic compared with the maximum. b, This is further highlighted by a   selectivity (middle bottom) and have equivalent explained variance for both the
    schematic representation, which shows the space of possible seRNNs. The pink      goal and the choice (bottom).
    box shows the overlap of all findings, where accurate, sparse, modular,



third from top), our analyses revealed that networks show a a Discussion
mixed-selective code at the decision point in the sweet-spot window Functioning brains have key organizational features endowing them with
identified before. Units here show a balanced code with information for computational capacities to perform a broad range of cognitive opera-
both goal and choices (Fig. 6c, bottom), whereas very dense or sparse tions efficiently and flexibly. These include sparse connectivity with a
networks show a preference for either goal or choices information. modular small-world structure25,27,52, generatable via homophilic wiring
As such, the density and related modular small-world structure influ- rules34–36, with spatially configured functional units that implement a
ences the time horizon of information flowing through the network. mixed-selective code30,45 and minimize energy expenditure29,48. We argue
Dense networks show greater focus on past information, which reso- that these complex hallmarks can be, at least in part, attributed to three
nates with how functional networks reconfigure to support memory⁵⁰. forces impacting virtually any brain network: optimization of functional
Supplementary Fig. 14 shows a correlation matrix showing pairwise performance in a (task) environment, metabolic/structural costs of the
relationships between features studied here. network and signal communication within the network. In this work
     Our findings show that there is a critical parameter window in we have shown that seRNNs allow us to manipulate these optimization
which both structural and functional brain features jointly emerge in goals, demonstrating that seemingly unrelated neuroscientific find-
seRNNs. Brains are often said to live in a unique but critical niche where ings can emerge in unison and appear to have a strong co-dependence.
all characteristics needed to support their function can exist in paral- We believe that these findings also have an impact on how we think about
lel⁵¹. seRNNs show the same preference for a critical parameter window the interlinked structural and functional optimization processes in the
but also give us the ability to study networks on their way to converging brain under economic constrains (‘Network economics in structural
on brain-like characteristics in this critical window. and functional neuroscience models’ in Supplementary Discussion).

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381 1376










                                             Regularization

    Regularization










 Explained Correlation of
 variance  selectivities  Corr( W,D)         ∑W










    Relative magnitude

Artice                                                                                                  https://doi.org/10.1038/s42256-023-00748-9

Our model provides an important tool to continue the work on jointly          biophysical space, we manipulated the regularization term. We hypoth-
studying structure and function in neuroscience models53–57. In addi-         esized that by incorporating constraints that appear common to any
tion, our results are relevant for developments on the intersection of        biological neural system, we could test whether these local constraints
neuroscience and artificial intelligence (NeuroAI⁵⁸) (‘Implications of        are sufficient to drive a network architecture that more closely resem-
seRNN findings on artificial intelligence’) in Supplementary Discussion.      bles observed brain networks. Specifically, we included spatial con -
There are many areas that we wish to improve on with future                   straints in two forms—Euclidean and network communication—that
research. Principally, our models did not include a substantial amount        we argue are integral to any realistic neural network. To implement
of biological detail that, while inevitably critical for neuronal function-   this, we first embed units within a 3D space, such that each unit has a
ing, does not speak to the observations we aimed to recapitulate in           corresponding x, y and z coordinate. Using these coordinates, we can
the present study. Implementing such details including molecular              generate a Euclidean distance matrix that describes the physical dis-
mechanisms guiding circuit development⁵⁹ or heterogeneous spiking             tance between each pair of nodes (Fig. 1b ). This allows to minimize
of neurons⁶⁰ will probably provide insights into the trade-offs specific      weights multiplied by their Euclidean distance (di,j), thereby incentiv-
to biological brains. The addition of such details will help us expand the    izing the network to minimize (costly) long-distance connections. The
applicability of our models to explore the effect of developmental time       element-wise matrix multiplication is denoted with the Hadamard
courses61,62, functional brain specialization⁶³ and how network vari-         product ⊙. Adding this to our optimization term gives us:
ability may underpin individual differences⁶⁴. Beyond these biological
details, it will be important to see how different functional goals would            L = LTask + γ ||W ⊙ D||        (3)
have differential effects on structural optimization processes. The sim-
ple working memory task used here provides a first realistic cognitive                         m m
challenge, but it will be interesting to consider seRNNs in continuous        ||W ⊙ D|| = ∑ ∑ ||wi, j|| × ||di, j||                            (4)
choice multi-task environments. Finally, it is unknown to what extent             i=1 j=1
the inclusion of biophysical constraints has on the randomness of net-               The above formalization provides a spatial context for RNN train-
work structure, although we speculate it would generate less-random           ing. In a next step, we want to follow the same approach to incentivize
network structures, compared with regular task-optimized networks.            networks to preferably prune weights that are not strongly contributing
  The development of seRNNs allowed us to observe the impact of               to the within-network communication structure. We can impose this
optimizing task control, structural cost and network communication            influence of communication via a weighted communicability term19,22,
in a model system that can dynamically trade off its structural and           which computes the extent to which, under a particular network topol-
functional objectives. This suggests that providing artificial neural         ogy, any two nodes are likely to communicate both directly and indi-
networks with a topophysical structure65,66 can enhance our ability to        rectly over time (Fig. 1c). Now taking this topological communication
directly link computational models of neural structure and function.          into account, we get the following loss function:
We believe that the modelling approach shown to work in seRNNs will
speed up innovations in neuroscience by allowing us to systematically              L = LTask + γ ||W ⊙ D ⊙ C||                                 (5)
study the relationships between features that all have been individually
discussed to be of high importance to the brain.                                       C = eS− 2¹ |W|S− 2¹                                     (6)
Methods
seRNN regularization function                                                        Supplementary Figs. 1–5 provide a walkthrough explanation of
In a canonical supervised RNN, all the network’s trainable parameters         how this term works and expand on the logic of how constraining the
are optimized to minimize the difference between the predicted value          network’s topology can serve as a prior for intra-network communica-
and correct value. To achieve this, we define a task loss function (L ),      tion in sparse networks. Supplementary Fig. 6 specifically highlights
which defines the prediction error to be minimized to optimize task           the role that communicability has within the network optimization
performance. To produce a network that generalizes well to unseen             process. Note that in equation (6), S is a diagonal matrix with the degree
data, we can add a regularization term. Regularization incentivizes           of unit i (degi) on the diagonal (that is, the node strength), which simply
networks to converge on sparse solutions and is commonly applied to           acts as a normalization term preventing any one single edge having
neural networks in general⁶⁷ and neuroscientific network models68,69.         undue influence¹⁹. This is explained in Supplementary Figs. 4 and 5.
For a regularized network, the loss function becomes a combination                    Importantly, as all terms (W, D, C) are element-wise multiplied
of both the task loss and the regularization loss. One example of a com-      within the regularization term, they are all minimized as part of the
monly applied regularization is the L1 regularization, which is also used     training process. Note, it is possible, in principle, to parameterize
in LASSO regression⁷⁰ and incentivizes the network to maximize task           each part of the above equation to vary the extent to which each term
performance while concurrently minimizing the sum of all absolute             influences network outcomes. However, in this work, we focus on estab-
weights in the neural network. If we want to regularize the recurrent         lishing the role of all in tandem. Future work could look to establish
weight matrix (W) with the dimensions m × m, where m is number of             models with greater parameterization to establish optimal relative
units in the recurrent layer, the loss function would be:                     magnitudes.

    L = LTask + L1 = LTask + γ ||W ||                        (1)              Task paradigm
                                                                              The task that networks are presented with is a one-choice inference task
    ||W || = ∑m ∑m |wi, j|                                   (2)              requiring networks to remember and integrate information (Fig. 1f). On
                          i=1 j=1                                             an abstract level, networks needed to first store a stimulus, integrate
                                                                              it with a second stimulus and make a predefined correct choice. More
An RNN with this loss function would learn to solve the task with a           specifically, networks first observe stimulus A for 20 time steps, fol -
sparse weight matrix (,), where γ would determine the extent to which         lowed by a delay for 10 time steps, followed by stimulus B for 20 steps.
the network is forced to converge on a sparse solution. This parameter        Agents must then make one choice. This set-up can be interpreted as a
is called the regularization strength.                                        one-step navigation task, where agents are presented with the goal loca-
Unlike regular RNNs, real brain networks are embedded in a physi-             tion (stimulus A) followed by possible choice directions (stimulus B).
cal space12–14. To simulate the pressures caused by existing in a             The choice to be made is the one moving closer to the goal. Extended

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381                                                                                   1377

Artice                                                                                                   https://doi.org/10.1038/s42256-023-00748-9

Data Table 1 outlines all possible trials and defines whether the given         be eliminated by matching the regularization spectra of both groups
trial is included in the regular version of the task used in the main text.     more closely. As we focus our analyses on highly functional networks
All stimuli are one-hot encoded with a vector of eight binary digits.           with high task accuracy, matching the regularization spectra of both
The first four define the goal locations and only one of the four digits        groups would have not influenced the results. The code repository
would be set to one during the goal presentation. The second four binary        has an overview file with regularization strengths chosen for different
digits each stand in for one allowed choice direction and two choice            network types. We hope that future implementations of the seRNNs
directions would be set to one during the choice options presentation.          can provide a method for more precise numerical matching between
Gaussian noise with a standard deviation of 0.05 is added to all inputs.        regularization strengths.
This task design is a simplified version of a multi-step maze naviga-
tion task we have recorded in macaques. A harder version of the task            Topological analysis
with an extended set of trials is equivalent to the first choice monkeys        Graph theory network statistics were calculated using the Brain Con-
face in their version of the task. We use the full set of trials for a control  nectivity Toolbox⁷¹, and the mathematical formalisms are provided. All
calculation in Supplementary Fig. 8. After this first choice, the monkeys       network statistics were calculated on the hidden RNN weight matrix and
then continue the task with a further step to reach the goal and collect        all edges were enforced to be the absolute value of the element. When
the reward. As the goal of this study was to establish the emerging             the measure in question was binary (for example, small-worldness)
features of seRNNs, here we focus just on the first choice and leave            a proportional threshold was applied, taking the top 10% of these
questions relating to the multi-step task to future investigations.             absolute connections.

RNN modelling                                                                   Modularity. The modularity statistic, Q, quantifies the extent to which
All recurrent neural networks in this project have 100 units in the hid-        the network can be subdivided into clearly delineated groups:
den layer and are defined by the same basic set of equations:                                            1                   k k
    h = ReLU (Wxxt + Whht−1 + bh)                                 (7)               Q =                        ∑ (a    i,j     i    j
    t                                                                                                    l  i, j∈N         −   l     ) δmimj ,    (9)

    yˆt     = σ (Wyht + by)                                       (8)           where  is number of connections,  is the total number of nodes,  is
       Here xₜ is the input vector at time t  (1 × 8), Wₓ is the input layer    the connection status between nodes  and  (, =1 when  and  are
                                                                                connected) and , = 0 otherwise, where  and j are the total number
weight matrix (8 × 100) (Xavier initialization), ht−1 is the activation of      of connections (degrees) of nodes  and . mi is the module containing
hidden layer at time t − 1 (1 × 100) (zeros initialization), Wₕ is the hidden   node i, and δₘiₘ = 1 if m  = m     and 0 otherwise. In     work, we tested
                                                                                    j      i                 j ,                   this
layer weight matrix (100 × 100) (orthogonal initialization), bₕ is the          the modularity using the default resolution parameter of 1.
bias of hidden layer (1 × 100) (zeros initialization), hₜ is the activation
of hidden layer at time t (1 × 100) (zeros initialization), Wy is the output    Small-worldness. Small-worldness refers to a graph property where
layer weight matrix (100 × 8) (Xavier initialization), by is the bias of        most nodes are not neighbours of one another, but the neighbours
network output (1 × 8) (zeros initialization), σ is the softmax activation      of nodes are likely to be neighbours of each other. This means that
function and yˆₜ is the network output/prediction.                              most nodes can be reached from every other node in a small number
             Networks differ in terms of which regularization was applied to    of steps. It is given by:
its hidden layer and with which regularization strength. Networks
are optimized to minimize a cross entropy loss on task performance                                                 σ = c/crand ,               (10)
combined with the regularization penalty using the Adam optimizer                                                      l/lrand
(hyperparameters: learning rate 0.001, beta_1 0.9, beta_2 0.999, epsilon
1 × 10−7) for 10 epochs. Note that the network’s choice is only read out        where c and crand are the clustering coefficients, and l and l rand are the
once, at the very end of the trial. Each epoch consists of 5,120 problems,      characteristic path lengths of the respective tested network and a ran-
batched in blocks of 128 problems.                                              dom network with the same size and density of the empirical network.
                                                                                Networks are generally considered as small-world networks at σ  > 1.
Regularization strength set-up and network selection                            In our work, we computed the random network as the mean statistic
The most critical parameter choice in our analyses is the regularization        across a distribution of n = 1,000 random networks. The characteristic
strength. As shown across analyses (for example, Fig. 6), the strength          path length is given by:
of the regularization has a major influence on all metrics analysed here.
While the L1 regularization and the purely Euclidean regularization                 Li =                           n1  ∑ ∑j∈N, j≠idi, j        (11)
could be matched by average strength of regularization of the hidden                                                   i∈N   n − 1
layer, the communicability term of seRNNs makes this challenging due
to it being dependent on the current state of the hidden layer and hence
changing throughout training. To match the spectrum of regulariza-              Generative network modelling
tion strengths in L1 and seRNNs, we used a functional approach. As              We use a technique called generative network modelling to investigate
performance in the task starts to break down as networks become too             whether the connectome of networks can be recreated by unsuper -
sparse to effectively remember past stimuli, we matched regularization          vised wiring rules. The idea is to start from an empty network and
strength using task performance before looking at any of the other              probabilistically add connections-based simple wiring equations. The
structural or functional metrics. Specifically, we set the regulariza -         wiring equations are based on the topological structure of the existing
tion spectrum on a linear scale and chose the boundary values so that           network. We follow the approach outlined in refs. 15,35. We provide an
task performance started to deteriorate half-way through the set of             overview of this approach in ‘Generative network modelling of RNNs’
networks (so around the 500th network for the sets of 1,000 networks).          in Supplementary Information.
        To make both groups comparable, we focus our analyses on net-
works that achieve >90% task accuracy. For the L1 networks, these               Decoding
were 47.9% of all trained networks and for seRNN networks 39%. Note             To analyse the internal function of our trained recurrent neural net -
that this difference in percentages is not meaningful per se and could          works, we record the hidden state activity of every unit while the

Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381                                                                                   1378

    Artice                                                                                                    https://doi.org/10.1038/s42256-023-00748-9

    network solves a set of 640 trials. Each trial is constituted of 50 steps        The above steps were done for all functional RNNs (>90% accuracy)
(as shown in Fig. 1e). For decoding, the activity is averaged in step win- for L1 and seRNNs. We presented distributions of these P perm values
dows of 5, so that there is a total of 10 time windows. In animal electro- for goals and choices to highlight how goal and choices information
physiology, researchers often look at the explained variance per task is clustered, distributed or random at key points in the sequence of
variable per unit. To allow for comparison of our networks with find - the task. To ensure that we did not bias our findings, we further com-
ings in the literature, we wanted to extract the same metric. Given the puted a slight variation of the above statistical test, which allows us
nature of our task, the variables used to predict unit activity (goal, choice to assess the clustering of coding information independently (that
options, correct choice) are highly correlated, so that the standard is, without computing relative goal versus choice coding, as in step
decoding with analysis of variance (ANOVA) would give biased results. 1 above). As cluster size was now not determined by the direction of
Instead, we used a decoding algorithm based on L1 regression, as follows. coding (as it was previously), we instead used the 50 units with the
        highest variance-explained values for a given variable. This was selected
     (1)   Apply cross-validated L1 regression with k-fold cross valida-         because this approximately mirrors the cluster sizes achieved in the pri-
           tion (5 folds) to set alpha term with best cross-validation           mary functional clustering analysis. Mirroring the permutation testing
           performance.                                                          approach, we calculated P  by ranking the mean Euclidean distance
     (2)   Split the dataset via repeated k-fold (3 folds, 2 repeats).                    perm
                                                                                 between these units (top 50% coding neurons) in a null distribution
     (3)   On each (train, test) dataset:                                        of Euclidean distance between 1,000 permuted samples of 50 units.
     (a)   Train L1 regression with the pre-set alpha term.                      This was done for goal and choice options (to assess replication). This
 (b) Calculate explained variance in test dataset including all predic- test is advantageous in that it allows for testing variables indepen -
           tor variables.                                                        dently, but disadvantageous in that it does not directly incorporate
     (c)   Iteratively set all values of a given set of predictors (for exam-    the coding magnitude into the test statistics. These findings are given
           ple, all goal predictors) to 0 and recalculate the explained vari-    in Supplementary Fig. 12.
           ance and calculate the drop of explained variance per predictor       Reporting summary
     (d)   group.                                                                Further information on research design is available in the Nature Port-
           Take mean of drop of explained variance for each group across         folio Reporting Summary linked to this article.
           splits of dataset.
           This algorithm results in every unit in every network being           Data availability
    assigned an explained variance number for every task variable. Note          No unique data were used in the production of this paper. Reference
    that the decoding cannot reliably work in networks that make too             values were extracted from the respective cited reference. All data
    many errors, so that we functionally analyse only networks with a task       shown in the figures are based on simulations, which are described in
    performance of 90% or above.                                                 the ‘Code availability’ section. The data files generated with simula -
                                                                                 tions that underlie the figures are available in the CodeOcean capsule
    Spatial permutation test                                                     belonging to this paper (https://doi.org/10.24433/CO.3539394.v2)⁷².
    To examine the spatial clustering of decoded task information of neu-
    ronal ensembles within the RNNs, we constructed a simple spatial             Code availability
    permutation test as follows.                                                 We provide detailed walkthroughs for the training of our recurrent
                                                                                 neural networks alongside all the code used to create the plots in this
     (1)   Considering a single RNN hidden layer at a particular task time       paper on CodeOcean (https://doi.org/10.24433/CO.3539394.v2)⁷². We
           window (note, explained variances change over the course of           provide additional example implementations of seRNNs on GitHub. As
           the task), for each unit, compute the relative preference for goal    new implementations of seRNNs become available, we will add them
           versus choice explained variance for each unit. This is calcu-        to this paper’s GitHub repository alongside the implementation used
           lated as the goal explained variance minus the choice explained       for this project. The GitHub repository is https://github.com/8erberg/
           variance.                                                             spatially-embedded-RNN.
     (2)   Between  all n ‘goal’ units (that is, positive difference from step
           1), compute the Euclidean distance weighted by the decoding           References
           for goal information. This, therefore, captures the spatial prox-     1.   Fair, D. A. et al. Functional brain networks develop from a ‘local to
           imity between goal units weighted by the magnitude of their                distributed’ organization. PLoS Comput. Biol. 5, e1000381 (2009).
           ‘goal’ information. Average this matrix to compute a summary          2.   Kaiser, M. Mechanisms of connectome development. Trends
           statistic. This is the observed statistic.                                 Cogn. Sci. 21, 703–717 (2017).
     (3)   Then repeat this procedure for 1,000 times, but for a random          3.   Bosman, C. & Aboitiz, F. Functional constraints in the evolution of
           set of n units taken from the 3D grid space. These 1,000 sum-              brain circuits. Front. Neurosci. 9, 303 (2015).
           mary statistics constitutes the null distribution.                    4.   Heuvel van den, M. P., Bullmore, E. T. & Sporns, O. Comparative
     (4)   Compute a permuted P value (Pₚₑᵣₘ), which is simply the loca-              connectomics. Trends Cogn. Sci. 20, 345–361 (2016).
           tion in which the observed statistic (step 2) sits within the null    5.   Hiratani, N. & Latham, P. E. Developmental and evolutionary
           distribution (step 3) normalized to the range [0 1]. This value            constraints on olfactory circuit selection. Proc. Natl Acad. Sci.
           subsequently corresponds to how clustered or distributed the               USA 119, e2100600119 (2022).
           observed goal decoding information is clustered in space rela-        6.   Miši, B. et al. Network-level structure–function relationships in
           tive to random chance. A small Pₚₑᵣₘ means that information is             human neocortex. Cereb. Cortex 26, 3285–3296 (2016).
           clustered more than chance and vice versa.                            7.   Smith, V. et al. Fluid intelligence and naturalistic task impairments
     (5)   Do steps 1–4, but between all ‘choices’ units (that is, negative           after focal brain lesions. Cortex 146, 106–115 (2022).
           difference from step 1).                                              8.   Doerig, A. et al. The neuroconnectionist research programme.
     (6)   Redo steps 1–5 for all desired time windows that have been de-             Nat. Rev. Neurosci. https://doi.org/10.1038/s41583-023-00705-w
           coded. In the current work, we calculated Pₚₑᵣₘ values for time            (2023).
     window 3, time window 6 and time window 9 to reflect different 9. Kaiser, M. & Hilgetag, C. C. Modelling the development of cortical
           aspects of the task over the sequence of the task.                         systems networks. Neurocomputing 58–60, 297–302 (2004).

    Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381                                                                                 1379

    Artice                                                                                                           https://doi.org/10.1038/s42256-023-00748-9

    10.   Mante, V., Sussillo, D., Shenoy, K. V. & Newsome, W. T.                     36.  Vértes, P. E. et al. Simple models of human brain functional
          Context-dependent computation by recurrent dynamics in                           networks. Proc. Natl Acad. Sci. USA 109, 5868–5873 (2012).
          prefrontal cortex. Nature 503, 78–84 (2013).                                37.  Kanwisher, N. Functional speciicity in the human brain: a window
    11.   Ali, A., Ahmad, N., De Groot, E., Johannes Van Gerven, M. A. &                   into the functional architecture of the mind. Proc. Natl Acad. Sci.
          Kietzmann, T. C. Predictive coding is a consequence of energy                    USA 107, 11163–11170 (2010).
     eiciency in recurrent neural networks. Patterns 3, 100639 (2022). 38. Thompson, W. H. & Fransson, P. Spatial conluence of
    12.   Barthélemy, M. Spatial networks. Phys. Rep. 499, 1–101 (2011).                   psychological and anatomical network constructs in the human
    13.   Bassett, D. S. & Stiso, J. Spatial brain networks. C. R. Phys.19  ,              brain revealed by a mass meta-analysis of fMRI activation. Sci.
          253–264 (2018).                                                                  Rep. 7, 44259 (2017).
    14.   Bullmore, E. & Sporns, O. The economy of brain network                      39.  Waskom, M. L. & Wagner, A. D. Distributed representation of
          organization. Nat. Rev. Neurosci. 13, 336–349 (2012).                            context by intrinsic subnetworks in prefrontal cortex. Proc. Natl
    15.   Akarca, D. et al. Homophilic wiring principles underpin neuronal                 Acad. Sci. USA 114, 2030–2035 (2017).
          network topology in vitro. Preprint at bioRxivhttps://doi.                  40. Ji, J. L. et al. Mapping the human brain’s cortical-subcortical
          org/10.1101/2022.03.09.483605 (2022).                                            functional network organization. NeuroImage 185, 35–57 (2019).
    16.   Song, H. F., Kennedy, H. & Wang, X.-J. Spatial embedding of                 41.  Steinmetz, N. A., Zatka-Haas, P., Carandini, M. & Harris, K. D.
          structural similarity in the cerebral cortex. Proc. Natl Acad. Sci.              Distributed coding of choice, action and engagement across the
          USA 111, 16580–16585 (2014).                                                     mouse brain. Nature 576, 266–273 (2019).
    17.   Avena-Koenigsberger, A., Misic, B. & Sporns, O. Communication               42.  Wallach, A., Melanson, A., Longtin, A. & Maler, L. Mixed selectivity
          dynamics in complex brain networks. Nat. Rev. Neurosci.19         , 17–33        coding of sensory and motor social signals in the thalamus of a
          (2018).                                                                          weakly electric ish. Curr. Biol. 32, 51–63.e3 (2022).
    18.   Laughlin, S. B. & Sejnowski, T. J. Communication in neuronal                43.  Hirokawa, J., Vaughan, A., Masset, P., Ott, T. & Kepecs, A. Frontal
          networks. Science 301, 1870–1874 (2003).                                         cortex neuron types categorically encode single decision
    19.   Crofts, J. J. & Higham, D. J. A weighted communicability measure                 variables. Nature 576, 446–451 (2019).
          applied to complex brain networks. J. R. Soc. Interface6 , 411–414          44. Whittington, J. C. R., Dorrell, W., Ganguli, S. & Behrens, T. E.
          (2009).                                                                          J. Disentanglement with biological constraints: a theory of
    20.   Griffa, A. et al. The evolution of information transmission in                   functional cell types. In The Eleventh International Conference on
          mammalian brain networks. Preprint at bioRxiv https://doi.org/                   Learning Representations (ICLR, 2023).
          10.1101/2022.05.09.491115 (2022).                                           45.  Fusi, S., Miller, E. K. & Rigotti, M. Why neurons mix: high
    21.   Seguin, C., Mansour L, S., Sporns, O., Zalesky, A. & Calamante,                  dimensionality for higher cognition. Curr. Opin. Neurobiol.37     ,
          F. Network communication models narrow the gap between the                       66–74 (2016).
          modular organization of structural and functional brain networks.           46. Bernardi, S. et al. The geometry of abstraction in the
          NeuroImage 257, 119323 (2022).                                                   hippocampus and prefrontal cortex. Cell 183, 954–967.e21
    22.   Estrada, E. & Hatano, N. Communicability in complex networks.                    (2020).
          Phys. Rev. E 77, 036111 (2008).                                             47.  Erez, Y. et al. Integrated neural dynamics for behavioural
    23.   Betzel, R. F., Medaglia, J. D. & Bassett, D. S. Diversity of meso-scale          decisions and attentional competition in the prefrontal cortex.
          architecture in human and non-human connectomes. Nat.                            Eur. J. Neurosci. 56, 4393–4410 (2022).
          Commun. 9, 346 (2018).                                                      48.  Attwell, D. & Laughlin, S. B. An energy budget for signaling in the
    24.   Bertolero, M. A., Yeo, B. T. T. & D’Esposito, M. The modular and                 grey matter of the brain. J. Cereb. Blood Flow Metab.21 , 1133–1145
          integrative functional architecture of the human brain. Proc. Natl               (2001).
          Acad. Sci. USA 112, E6798–E6807 (2015).                                     49.  Beggs, J. M. The criticality hypothesis: how local cortical networks
    25.   Park, H.-J. & Friston, K. Structural and functional brain networks:              might optimize information processing. Phil. Trans. R. Soc. Math.
          from connections to cognition. Science 342, 1238411 (2013).                      Phys. Eng. Sci. 366, 329–343 (2008).
    26.   Sporns, O. & Betzel, R. F. Modular brain networks. Annu. Rev.               50. Cohen, J. R. & D’Esposito, M. The segregation and integration of
          Psychol. 67, 613–640 (2016).                                                     distinct brain networks and their relationship to cognition.
    27.   Bassett, D. S. & Bullmore, E. T. Small-world brain networks                      J. Neurosci. 36, 12083–12094 (2016).
          revisited. Neuroscientist 23, 499–516 (2017).                               51.  O’Byrne, J. & Jerbi, K. How critical is brain criticality? Trends
    28.   Sporns, O. & Zwi, J. D. The small world of the cerebral cortex.                  Neurosci. 45, 820–837 (2022).
          Neuroinformatics 2, 145–162 (2004).                                         52.  Yan, C. & He, Y. Driving and driven architectures of directed
    29.   Johnston, W. J., Palmer, S. E. & Freedman, D. J. Nonlinear mixed                 small-world human brain functional networks. PLoS ONE6 ,
          selectivity supports reliable neural computation. PLoS Comput.                   e23460 (2011).
          Biol. 16, e1007544 (2020).                                                  53.  Suárez, L. E., Richards, B. A., Lajoie, G. & Misic, B. Learning
    30. Rigotti, M. et al. The importance of mixed selectivity in complex                  function from structure in neuromorphic networks. Nat. Mach.
          cognitive tasks. Nature 497, 585–590 (2013).                                     Intell. 3, 771–786 (2021).
    31.   Hilger, K., Ekman, M., Fiebach, C. J. & Basten, U. Intelligence is          54.  Lindsay, G. W., Rigotti, M., Warden, M. R., Miller, E. K. & Fusi,
          associated with the modular structure of intrinsic brain networks.               S. Hebbian learning in a random network captures selectivity
          Sci. Rep. 7, 16088 (2017).                                                       properties of the prefrontal cortex. J. Neurosci.37  , 11021–11036
    32.   Watts, D. J. & Strogatz, S. H. Collective dynamics of ‘small-world’              (2017).
          networks. Nature 393, 440–442 (1998).                                       55.  Finzi, D., Margalit, E., Kay, K., Yamins, D. L. & Grill-Spector,
    33.   Bassett, D. S. & Sporns, O. Network neuroscience. Nat. Neurosci.                 K. Topographic DCNNs trained on a single self-supervised
          20, 353–364 (2017).                                                              task capture the functional organization of cortex into visual
    34.   Betzel, R. F. et al. Generative models of the human connectome.                  processing streams. In NeurIPS 2022 Workshop SVRHM (2022);
          NeuroImage 124, 1054–1064 (2016).                                                https://openreview.net/forum?id=E1iY-d13smd
35. Akarca, D., Vértes, P. E., Bullmore, E. T. & Astle, D. E. A generative 56. Damicelli, F., Hilgetag, C. C. & Goulas, A. Brain connectivity
          network model of neurodevelopmental diversity in structural                      meets reservoir computing. PLOS Comput. Biol. 18, e1010639
          brain organization. Nat. Commun. 12, 4216 (2021).                                (2022).

    Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381                                                                                          1380

Artice https://doi.org/10.1038/s42256-023-00748-9

57. Goulas, A., Damicelli, F. & Hilgetag, C. C. Bio-instantiated recurrent this work: UKRI MRC funding (MC_UU_00030/7 and MC-A0606-
     neural networks: integrating neurobiology-based network 5PQ41): J.A., D.A., D.E.A. and J.D. James S. McDonnell Foundation
     topology in artiicial networks. Neural Netw. 142, 608–618 (2021). Opportunity Award and the Templeton World Charity Foundation, Inc.
58. Zador, A. et al. Catalyzing next-generation artiicial intelligence (funder DOI 501100011730) under the grant TWCF-2022-30510: D.A.
     through NeuroAI. Nat. Commun. 14, 1597 (2023). and D.E.A. For the purpose of open access, the authors have applied a
59. Moons, L. & De Groef, L. Molecular mechanisms of neural circuit Creative Commons Attribution (CC BY) license to the text, igures and
     development and regeneration. Int. J. Mol. Sci.22 , 4593 (2021). code relating to this paper.
60. Perez-Nieves, N., Leung, V. C. H., Dragotti, P. L. & Goodman, D. F.
     M. Neural heterogeneity promotes robust learning. Nat. Commun. Author contributions
     12, 5791 (2021). J.A., D.A., D.J.S., J.D. and D.E.A. were involved in the conceptualization
61. Baxter, R. A. & Levy, W. B. Constructing multilayered neural and methodological developments of the study. J.A. and D.A.
     networks with sparse, data-driven connectivity using conducted the analyses. J.A., D.A., D.J.S., J.D. and D.E.A interpreted
     biologically-inspired, complementary, homeostatic mechanisms. the results. J.A. and D.A. wrote the paper in consultation with
     Neural Netw. 122, 68–93 (2020). J.D. and D.E.A.
62. Chechik, G., Meilijson, I. & Ruppin, E. Synaptic pruning in
     development: a computational account. Neural Comput. 10, Competing interests
     1759–1777 (1998). The authors declare no competing interests.
63. Johnson, M. H. Interactive specialization: a domain-general
     framework for human functional brain development? Dev. Cogn. Additional information
     Neurosci. 1, 7–21 (2011). Extended data is available for this paper at
64. Siugzdaite, R., Bathelt, J., Holmes, J. & Astle, D. E. Transdiagnostic https://doi.org/10.1038/s42256-023-00748-9.
     brain mapping in developmental disorders. Curr. Biol.30 ,
     1245–1257.e4 (2020). Supplementary information The online version
65. Bassett, D. S. et al. Eicient physical embedding of topologically contains supplementary material available at
     complex information processing networks in brains and https://doi.org/10.1038/s42256-023-00748-9.
     computer circuits. PLoS Comput. Biol. 6, e1000748 (2010).
66. Sperry, M. M., Telesford, Q. K., Klimm, F. & Bassett, D. S. Rentian Correspondence and requests for materials should be addressed to
     scaling for the measurement of optimal embedding of complex Jascha Achterberg or Danyal Akarca.
     networks into physical space. J. Complex Netw.5 , 199–218 (2017).
67. Hardt, M. & Recht, B. Patterns, Predictions, and Actions (Princeton Peer review information Nature Machine Intelligence thanks Bratislav
     Univ. Press, 2022). Misic, and the other, anonymous, reviewer(s) for their contribution to
68. Kietzmann, T. C. et al. Recurrence is required to capture the the peer review of this work.
     representational dynamics of the human visual system. Proc. Natl
     Acad. Sci. USA 116, 21854–21863 (2019). Reprints and permissions information is available at
69. Yang, G. R., Joglekar, M. R., Song, H. F., Newsome, W. T. & Wang, www.nature.com/reprints.
     X.-J. Task representations in neural networks trained to perform
     many cognitive tasks. Nat. Neurosci. 22, 297–306 (2019). Publisher’s note Springer Nature remains neutral with regard to
70. Tibshirani, R. Regression shrinkage and selection via the LASSO.  jurisdictional claims in published maps and institutional ailiations.
     J. R. Stat. Soc. Ser. B 58, 267–288 (1996).
71. Rubinov, M. & Sporns, O. Complex network measures of brain Open Access This article is licensed under a Creative Commons
     connectivity: uses and interpretations. NeuroImage 52, 1059– Attribution 4.0 International License, which permits use, sharing,
     1069 (2010). adaptation, distribution and reproduction in any medium or format,
72. Achterberg, J., Akarca, D., Strouse, D. J., Duncan, J. & Astle, D. as long as you give appropriate credit to the original author(s) and the
     E. Capsule for Achterberg & Akarca, et al: Spatially-embedded source, provide a link to the Creative Commons license, and indicate
     recurrent neural networks reveal widespread links between if changes were made. The images or other third party material in this
     structural and functional neuroscience indings. CodeOcean article are included in the article’s Creative Commons license, unless
     https://doi.org/10.24433/CO.3539394.v2 (2023). indicated otherwise in a credit line to the material. If material is not
Acknowledgements included in the article’s Creative Commons license and your intended
        use is not permitted by statutory regulation or exceeds the permitted
We thank M. Botvinick for helpful comments and input throughout use, you will need to obtain permission directly from the copyright
the development of this project. We thank M. Dillinger for detailed holder. To view a copy of this license, visit http://creativecommons.
comments on the paper. J.A. receives a Gates Cambridge Scholarship. org/licenses/by/4.0/.
D.A. receives a Cambridge Trust Vice Chancellor’s Scholarship.
D.J.S. is funded by Google DeepMind. The following grants supported © The Author(s) 2023










    Nature Machine Inteigence | Voume 5 | December 2023 | 1369–1381    1381

Artice                                           https://doi.org/10.1038/s42256-023-00748-9

Extended Data Table 1 | List of all problems that make up the task that networks are trained on

 Problem   Stimulus A        Stimulus B      Correct Choice                                    Regular Task

 1         (Right, up)       Left, right     Right                                             No
 2         (Right, up)       Right, down     Right                                             Yes
 3         (Right, up)       Up, down        Up                                                No
 4         (Right, up)       Up, left        Up                                                Yes
 5         (Right, down)     Left, right     Right                                             Yes
 6         (Right, down)     Up, right       Right                                             No
 7         (Right, down)     Up, down        Down                                              No
 8         (Right, down)     Left, down      Down                                              Yes
 9         (Left, up)        Left, right     Left                                              Yes
 10        (Left, up)        Left, down      Left                                              No
 11        (Left, up)        Up, down        Up                                                No
 12        (Left, up)        Up, right       Up                                                Yes
 13        (Left, down)      Left, right     Left                                              No
 14        (Left, down)      Up, left        Left                                              Yes
 15        (Left, down)      Up, down        Down                                              No
 16        (Left, down)      Right, down     Down                                              Yes










Nature Machine Inteigence

   nature portfolio
    a     P r 1     Corresponding author(s):    Jascha Achterberg, Danyal Akarca
                    Last updated by author(s):  Sep 14, 2023        3


Reporting Summary E

Nature Portfolio wishes to improve the reproducibility of the work that we publish. This form provides structure for consistency and transparency
in reporting. For further information on Nature Portfolio policies, see our Editorial Policies and the Editorial Policy Checklist. 3





    Statistics

For all statistical analyses, confirm that the following items are present in the figure legend, table legend, main text, or Methods section.

    n/a | Confirmed
        The exact sample size (n) for each experimental group/condition, given as a discrete                number and unit of measurement
        A statement on whether measurements were taken from distinct samples or whether the same sample was measured repeatedly

    Nx  The statistical test(s) used AND whether they are one- or two-sided
        Only common tests should be described solely by name; describe more complex techniques in the Methods section.

        A description of all covariates tested

        A description of any assumptions or corrections, such as tests of normality and adjustment for multiple comparisons.

 Nx A full description of the statistical parameters including central tendency (e.g. means) or other basic estimates (e.g. regression coefficient)
        AND variation (e.g. standard deviation) or associated estimates of uncertainty (e.g. confidence intervals)

 Nx For null hypothesis testing, the test statistic (e.g. F, t, r) with confidence intervals, effect sizes, degrees of freedom and P value noted
        Give P values as exact values whenever suitable.

        For Bayesian analysis, information on the choice of priors and Markov chain Monte Carlo settings

        For hierarchical and complex designs, identification of the appropriate level for tests and full reporting of outcomes

        Estimates of effect sizes (e.g.  Cohen's d, Pearson's r), indicating how they were calculated
                                                                                                            of the points above.
                                         Our webcollection onstatistics for biologists contains articles on many


    Software and code

    Policy information about availability of computer code

  Data collection The data used in our manuscript was generated using Python 3.7.9 and Tensorflow 2.3.0 as outlined in the manuscripts methods. The
        GitHub repository and Code Ocean Capsule linked in the manuscript provides a working version of the new Recurrent Neural Networks
        developed in this manuscript.

     Data analysis     Our data analysis was based on Python (3.9.1), Numpy (1.19.2), statsmodels 0.12.1 scikit-learn (0.23.2), scipy (1.5.2), pandas (1.2.1), Matlab
                       2020b; Brain Connectivity Toolbox 2019 brain-connectivity-toolbox.net

For manuscripts utilizing custom algorithms or software that are central to the research but not yet described in published literature, software must be made available to editors and
reviewers, We strongly encourage code deposition in a community repository (e.g. GitHub). See the Nature Portfolio guidelines for submitting code & software for further information


    Data                                                                                                                                        _
    Policy information   about availability of data                                                                                             3
    All  manuscripts must include a data availability statement. This statement should provide the following information, where applicable:     S
         -  Accession codes, unique identifiers, or web links for publicly available datasets
         -  Adescription of any restrictions on data availability
                         or third party data,    please ensure that the statement adheres to our policy
         ~  For clinical datasets


    We provide detailed walkthroughs for the training of our recurrent neural networks alongside all the code used to create the plots in this manuscript on CodeOcean

                                                 We provide additional example implementations of seRNNs on GitHub. As new implementations of seRNNs
                                         the implementation used for this project. The GitHub repository is: https://
    become available we will add them to this paper's GitHub repository alongside

    github.com/8erberg/spatially-embedded-RNN.                                                                       5

    Human research participants                                                                                      E
    Policy information   about studies involving human research participants and Sex and Gender in Research.         =

     Reporting on sex and gender ~~  NA                                                                              I<
     Population    characteristics   NA                                                                              5
     Recruitment                     NA

     Ethics oversight                NA                                                                              =
                                                                                                                     =
    Note that full information on the approval of the study protocol must also be provided in the manuscript.








Please select the one below that is the best fit for your research. If you are not sure, read the appropriate sections before making your selection.

    Life sciences Behavioural & social sciences [| Ecological, evolutionary & environmental sciences

For a reference copy of the document with all sections, see nature.com/documents/nr-reporting-summary-flat.pdf








    All studies must disclose on these points even when the disclosure is negative.

     Sample size     We sample 1000 networks per group (seRNN vs L1 networks), so 2000 networks in total. We sample an additional set of 1000 networks for
        supplementary control analyses (seRNN [standard], seRNN [hard task], seRNN [random inputs], seRNN [Distance only], seRNN
        [Communicability only], seRNN [Short delay period], seRNN [Long delay period], seRNN [Low noise], seRNN [High noise], L1; 100 networks per
        group)

  Data exclusions In this manuscript we only analyse networks which reach > 90% task accuracy. Note that we do not apply an accuracy criteria for the seRNN
        [random inputs] control group used in supplementary control analyses.

     Replication     As we based our analysis on large groupsof independently trained networks we already show that our results replicate across networks. Our
                                     to      parameter
                     results are limited a subset of the     space     as discussed in the manuscript. The exact training parameters are available in the Code
                     Ocean Capsule.

     Randomization   NA

     Blinding        NA




Reporting for specific materials, systems and methods
We require information from authors about some types of materials, experimental systems and methods used in many studies. Here, indicate whether each material,
system or method listed is relevant to your study. If you are not sure if a lst item applies to your research, read the appropriate section before selecting a response.


    Materials & experimental systems   Methods
    n/a | Involved in the study        n/a | Involved     in the study
     Antibodies                              chip-seq

     Eukaryotic cell lines                   Flow cytometry                                                          S
     Palaeontology and archaeology           MRI-based neuroimaging


     Animals and other organisms

     clinical data

     Dual use research of concern
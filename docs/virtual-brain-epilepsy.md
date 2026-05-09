    nature computational science



    Article    https://doi.org/10.1038/s43588-025-00841-6
    Virtual brain twins for stimulation in epilepsy




Received: 13 August 2024 Huifang E. Wang 1 , Borana Dollomaja¹, Paul Triebkorn 1,
Accepted: 23 June 2025 Gian Marco Duma1,2, Adam Williamson¹, Julia Makhalova3,4,5,
        Jean-Didier Lemarechal¹, Fabrice Bartolomei1,3 & Viktor Jirsa 1
Published online: 5 August 2025

   Check for updates Estimating the epileptogenic zone network (EZN) is an important part of the
        diagnosis of drug-resistant focal epilepsy and has a pivotal role in treatment
        and intervention. Virtual brain twins provide a modeling method for
        personalized diagnosis and treatment. They integrate patient-specific brain
        topography with structural connectivity from anatomical neuroimaging
        such as magnetic resonance imaging, and dynamic activity from functional
        recordings such as electroencephalography (EEG) and stereo-EEG (SEEG).
        Seizures show rich spatial and temporal features in functional recordings,
        which can be exploited to estimate the EZN. Stimulation-induced
        seizures can provide important and complementary information.
        Here we consider invasive SEEG stimulation and non-invasive temporal
        interference stimulation as a complementary approach. This paper offers
        a high-resolution virtual brain twin framework for EZN diagnosis based on
        stimulation-induced seizures. It provides an important methodological
        and conceptual basis to make the transition from invasive to non-invasive
        diagnosis and treatment of drug-resistant focal epilepsy.


In the most complex cases of drug-resistant focal epilepsy, accurate brain models based on data from an individual’s brain for scientific and
diagnosis requires invasive stereo-electroencephalography (SEEG) clinical use. In this study, we introduce a high-resolution virtual brain
implantation. This procedure is crucial for estimating the epilepto- twin workflow, specifically designed for estimating the EZN using a
genic zone network (EZN), a key element for successful treatment1,2. stimulation paradigm.
SEEG has become one of the principal techniques for delineating SEEG stimulation, involving direct electrical stimulation through
EZNs3,4. In the past 15 years, several data analysis methods for quan- SEEG electrodes, can be used to map brain function, as well as to
tifying EZNs have been proposed based on the spectral analysis of provoke seizures for better EZN diagnosis, especially when sponta-
SEEG signals5,6. Beyond pure data-driven analysis approaches, several neous seizures are not obtained. SEEG-stimulation-induced seizures
methods linking mechanistic models and data analysis have been (at 1 Hz or 50 Hz, usually with pulses of 1 ms at 1–3 mA) are an impor-
developed7–12, formally exploiting causal hypotheses within an infer- tant tool for localizing the EZN and are also associated with a better
ence framework. We developed a workflow for the estimation of a post-surgical outcome18–20. First, we propose a high-resolution person-
patient’s EZN using personalized whole-brain models, called the virtual alized whole-brain model—a virtual brain twin—dedicated to assessing
epileptic patient (VEP)13–16. The VEP workflow was evaluated retrospec- stimulations performed through SEEG electrodes. Then, we evaluate
tively using 53 patients with 187 spontaneous seizures and is now being the capacity of our approach to translate from invasive stimulation
evaluated in an ongoing clinical trial (EPINOV) with 356 prospective and recording via SEEG to non-invasive procedures using scalp-EEG
patients with epilepsy14,15. The virtual brain twin concept was proposed recordings and transcranial electrical stimulation techniques, nota-
based on the VEP workflow and has been extended to various brain dis- bly temporal interference (TI) stimulation²¹. The recently developed
orders¹⁷. Virtual brain twins are personalized, generative and adaptive TI stimulation has the capacity of reaching deeper structures than


1Aix Marseille Université, INSERM, INS, Institut de Neurosciences des Systèmes, Marseille, France. 2Scientific Institute, IRCCS E.Medea, Epilepsy and Clinical
Neurophysiology Unit, Conegliano, Italy. ³Epileptology and Clinical Neurophysiology Department, APHM, Timone Hospital, Marseille, France. ⁴Aix Marseille
Université, CNRS, CRMBM, Marseille, France. ⁵APHM, Timone University Hospital, CEMEREM, Marseille, France. e-mail: huyfang.wang@univ-amu.fr;
viktor.jirsa@univ-amu.fr

Nature Computational Science | Volume 5 | September 2025 | 754–768 754

    Article        https://doi.org/10.1038/s43588-025-00841-6

        b                 Brain imaging data

        T1-weighted MRI Diffusion-weighted MRI  SEEG recording







                                                                                            Time

     c      SEEG stimulation         Personalization from
         Bipolar electrical          patient-specific data                              e   SEEG recording      f  EZN estimation
         stimulation     a                                                                                                                                                i
         22                          B

                                                                                                                        i
                                                                                                     Time     Model 0   Posterior of                                     1
         Stimulation                     Simulation                                                      inversion      EVs
     d     Temporal interference                                                           Scalp-EEG recording                                                             EZ
        @     I(f)  Envelope      F      —     .                                                =⁴   —                                                                   &
                              ∆f  High-resolution
     I(f + ∆f)        aff       personalized models                                             =
                      TAR     for stimulations                                                       Time

    Fig. 1 | The workflow of the virtual brain twin for estimating the EZN using        f and f + Δf. The currents generate oscillating electric fields, which results in
    stimulation techniques. a,b, A personalized high-resolution model (a) is            an envelope amplitude that is modulated periodically at Δf. The electric field
    based on individual brain geometry extracted from T1-weighted MRI and               influences the brain activity that can be generated by the high-resolution
    structural connectivity from tractography on diffusion-weighted MRI data (b).       personalized whole-brain model (a). The red and blue dots represent SEEG
    High-resolution virtual brain models simulate neural source activity with           and scalp-EEG electrodes, respectively. e, The simulated source activity can be
    spatial resolutions of about 10 mm². The modeling parameters are inferred           mapped onto the corresponding SEEG and scalp-EEG signals, through the gain
    from the spontaneous SEEG recordings (b). c,d, We illustrate two types of           matrices, which are constructed based on the locations of SEEG and scalp-EEG
    stimulation: SEEG and TI, to induce seizure activity. c, SEEG stimulation uses      electrodes relative to the source vertices. The red curves on the scalp-EEG
    bipolar stimulation in which two electrodes are used: one serves as the cathode     recordings are plotted using a different scale to visualize the signals following
    and the other as the anode. The electric current flows between two electrodes,      the high-amplitude signals induced by TI stimulation. f, By utilizing data features
    which is parameterized by current amplitude, pulse width and frequency.             extracted from SEEG and scalp-EEG signals, Bayesian inference methods can
    d, TI stimulation applies two current sources (I) simultaneously via electrically   estimate a posterior distribution of EVs, suggesting the potential EZN.
    isolated pairs of scalp electrodes (green and pink) at kliohertz frequencies



conventional transcranial direct- and alternating-current stimula- Results
tion (tDCS and tACS)22,23. Thus, combining the advantages of tDCS ~~ VEP-stimulation workflow
and deep brain stimulation²⁴, TI stimulation is non-invasive, focal and We built a high-resolution virtual brain twin workflow to estimate the EZN
capable of targeting deep brain structures. TI stimulation exploits the using stimulation techniques. First, we built a virtual brain twin based
brain’s insensitivity to high-frequency electric fields in the kilohertz on available data before stimulation. An EZN is defined as the tissue
range, as demonstrated in a recent clinical trial with patients with responsible for generating seizures and may involve distant brain areas
epilepsy²⁵. TI stimulation occurs when electric fields generated by characterized by altered excitability¹. Our model-based high-resolution
multiple electrode pairs with slightly different frequencies interfere workflow using perturbation techniques for diagnostic EZN mapping
at a target location. This interference produces an envelope modula- is shown in Fig. 1 and a detailed flowchart is shown in Supplementary
tion at a lower frequency—equal to the difference between source Fig. 1. First, high-resolution full-brain network models (Fig. 1a) were
frequencies (normally below 150 Hz)—which effectively stimulates established using patient-specific data from patients with epilepsy. The
the target tissue. structure of the model was defined by the detailed surface of the cortex
     In summary, this study presents a workflow for estimating the and the subcortical volumes from T1-weighted MRI. The global struc-
EZN using a personalized high-resolution virtual brain twin under a tural connectivity between brain regions through white matter fibers
stimulation paradigm. We develop a pipeline that (1) builds a personal- was estimated from diffusion-weighted magnetic resonance imaging
ized high-resolution brain model for either SEEG or TI stimulation; (2) (MRI). The cortical surface data were generated from T1-weighted MRI,
estimates the EZN from stimulation-induced seizures, and validates resulting in surfaces with 20,284 vertices with a vertex area of about
it by simulated data; (3) refines the estimation of EZN by integrating 10 mm². We simulated the time series on the patient’s specific structural
multiple recording modalities, such as by combining scalp-EEG and scaffold using the phenomenological Epileptor model²⁶, a system of
SEEG; and (4) extends the pipeline to incorporate region-specific het- differential equations that can describe seizure initiation, propagation
erogeneity in local connectivity and support different brain atlases. and termination, resulting in electrophysiological seizure-like events.
This research provides a necessary step for (1) a series of scientific The spatial domain of the Epileptor is given by the high-resolution net-
and clinical studies, such as optimization of stimulation parameters work of neural populations; thus, seizures can propagate locally across
for diagnosis and treatment; (2) moving from invasive to non-invasive neighboring vertices of the cortex and globally through white matter
diagnosis and treatment of drug-resistant focal epilepsy; and (3) natural fiber connections⁷. The initial personalized modeling parameters can
integration of multiple functional data modalities. be inferred from the spontaneous seizure recording¹⁵.

Nature Computational Science | Volume 5 | September 2025 | 754–768 755










     Channels



Channels  Channels










     Brain regions

Article https://doi.org/10.1038/s43588-025-00841-6

        a SEEG time series under SEEG stimulation b Distributions of EVs
        Left O2
        TB'3-4 Left O1
        GC'3-4 Left lingual gyrus
        CU'10-11 Left T2 posterior
        CU'6-7 Left occipital pole
        FCA'7-8
        GL'11-12 Left calcarine sulcus
        GL'5-6 Left STS posterior
        GL'1-2 Left cuneus
        PFG'9-10 Left lingual sulcus
        B'2-3 Left temporal pole

        70 80 90 100 110 120 130 140 0 0.5 1.0
        Times (ms) Normalized EVs
        c Heatmap of EZN in preoperative T1-MRI

        e Spatial map of EZN





    Right  Left    Right  Left


    d Heatmap of EZN in postoperative T1-MRI


    Left O2



    Right  Left    Right  Left


Fig. 2 | VEP diagnostic mapping for spontaneous seizures (empirical data). the 25th percentile, the median and the 75th percentile, respectively. All violin
a, SEEG recordings from one seizure in a 23-year-old female patient. The left axis plots in this paper follow the same format. c, Heatmap of the left O2 identified by
shows the names of the selected electrode channels. b, Posterior distribution VEP (in red) shown in a preoperative T1-MRI. d, Heatmap of the left O2 identified
of the EVs (higher value indicates higher probability of seizure) for ten selected by VEP (in red) shown in a postoperative T1-MRI. e, The left O2 (in red) was
regions obtained from the HMC pipeline. Each violin plot shows the distribution projected on the patient’s 3D meshes.
of the entire data range using a kernel density estimate. The three bars represent



    We then developed a high-resolution virtual brain twin designed Model inversion estimates patient-specific brain model param-
for stimulation. First, we calculated the electric fields induced by eters, especially epileptogenicity and global network scaling using
both stimulation methods (Fig. 1c,d). For the SEEG stimulation, two Hamiltonian Monte Carlo (HMC) sampling techniques from Bayesian
SEEG electrodes serve as cathode and anode to generate bipolar inference methods10,15. The estimation is based on the structural brain
stimulation and electric current flow is parameterized by current scaffold, modeled seizure dynamics and the data feature extracted
amplitude, pulse width and frequency (Fig. 1c). The perturbation from scalp-EEG and/or SEEG seizure recordings (Fig. 1e). The model
effect was applied to the vertices of the high-resolution surface inversion uses a non-informative prior where all the brain regions have
through the SEEG-to-source mapping, with perturbation strength the same prior distribution (the prior assumption is that all regions are
decaying as the distance between vertices and electrodes increased. healthy). The result is the posterior probability from which the EZN is
For TI stimulation, we calculated the amplitude of the envelope of identified. We also introduced multimodal inference for simultaneous
the TI electric field projected onto the surface normal vector at each SEEG and scalp-EEG to infer the EZN (Fig. 1f).
vertex (Fig. 1d). Both types of stimulation generated an accumulation
in the slow state variable m of the Epileptor-stimulation model (equa- Virtual brain twins for SEEG stimulation
tion (1)), which represents stimulation-induced tissue changes. When We used the data from a right-handed 23-year-old female patient
m reaches a given threshold, the model undergoes a transition into diagnosed with left occipital lobe epilepsy to illustrate how to use our
the seizure state. A post-SEEG implantation computed tomography workflow. We first extracted the brain geometry, the structural con-
(CT) scan is used to localize SEEG contacts and co-register them with nectivity matrix and the source-to-sensor mapping using this patient’s
the structural scaffold. Scalp-EEG electrodes were placed on the scalp T1-weighted MRI, diffusion-weighted MRI and post-SEEG-implantation
using the standard international 10-5 system. This high-resolution CT scans. We built the whole-brain neural mass model based on this
model allows us to consider detailed electric dipoles, generated anatomical information. Then we ran the HMC algorithm for three spon-
by neural activity, for building high-fidelity forward solutions. taneous seizures recorded from this patient (one of the three seizures
The source-to-sensor matrix maps the activity from the neural with selected electrodes is shown in Fig. 2a). We pooled the posterior
sources—located at vertices of the cortical surface and subcortex—to distribution from the three seizures, in which the left lateral occipital
SEEG or scalp-EEG electrodes, taking into account their orientation cortex (region O2 (in the VEP atlas²⁷)) was consistently identified as
and distance. part of the EZN. Then we projected the left O2 onto both preoperative

Nature Computational Science | Volume 5 | September 2025 | 754–768 756

    Article                           https://doi.org/10.1038/s43588-025-00841-6

        a     SEEG stimulation        b     Source activity

                                  50 Hz, 3 s on    775.0 ms  1,185.0 ms  3,685.0 ms
                                  bipolar GL'5-6





    High-resolution spatial mapping of the stimulation
                                      4,645.0 ms      5,385.0 ms


                                      Low      High
                                                                             Brain source
                                                                          activity (a.u.)
                                  Low      High
                                  Amplitude of electric field (V/m)

    c  SEEG time series under SEEG stimulation        d     Distributions of EVs

      TB'3-4                                                        Left O2
      GC'3-4                                             Left lingual gyrus
    CU'10-11                                            Left occipital pole
      CU'6-7                                          Left calcarine sulcus
     FCA'7-8                                             Left STS posterior
                                                                Left cuneus
    GL'11-12                                            Left lingual sulcus
      GL'5-6                                                       Right O1
      GL'1-2                                             Left temporal pole
    PFG'9-10                                                              0     0.25 0.50  0.75  1.00
       B'2-3                                                                     Normalized EVs
           2,000                  4,000      6,000            8,000  10,000
                                      Time (ms)
    e  Heatmap of EZN                 f                  Spatial map of EZN


                                  Left O2

                                                  Left lingual gyrus
    Right      Left               Right  Left     Left occipital pole


Fig. 3 | Estimating EZN from a SEEG-stimulation-induced seizure (synthetic d, Posterior distribution of the EVs (higher value indicates higher chance for
data). a, Top: GL’5-6 (large blue/red sphere) is the stimulated contact in the left seizure) of nine selected regions obtained from HMC sampling. Each violin plot
occipital lobe, using a bipolar pulse stimulation (50 Hz for a duration of 3.5 s with shows the distribution of the entire data range using a kernel density estimate.
pulse duration 1 ms). Bottom: spatial map showing the amplitude of electric field The three bars represent the 25th percentile, the median and the 75th percentile,
(indicated by the color bar) at each brain vertex, induced by SEEG stimulation respectively. Red regions indicate highest chance of being the EZN; the other
from contact pair GL’5-6. b, Neural source activity in arbitrary units (a.u.) is areas are in green. e,f, The region of the highest EV posterior distribution is the
shown on the cortical mesh at five different time points, with values indicated left O2 in red shown in T1-MRI (e) and the 3D brain (f). The two regions (the left
by color. The seizures are located around the left O2 region of the VEP atlas. lingual gyrus and the left occipital pole) are shown in yellow.
c, Selected simulated SEEG time series from a SEEG-stimulation-induced seizure.



and postoperative T1-MRI slides and three-dimensional (3D) brain were located around the left O2 regions (Fig. 3b and Supplementary
meshes (in Fig. 2c–e). The patient underwent resective surgery, in which Video 1). From these simulated neural source signals, we obtained SEEG
a large portion of the left O2 was removed (in Fig. 2d), and was almost signals (Fig. 3c) using the source-to-sensor matrix.
seizure-free after surgery (surgery outcome class of Engel II²⁸). On the These synthetic SEEG recordings (Fig. 3c) were used for model
basis of this result, we built the high-resolution whole-brain neural field inversion, to estimate the EZN. We obtained the left O2 with the high-
model for SEEG and TI stimulation to test the hypothesis that the left est epileptogenic values (EVs) out of all the samples according to the
O2 was the EZN of the patient. posterior distribution from the HMC algorithm (Fig. 3d). The two
     To model direct electrical stimulation by SEEG electrodes in the neighboring regions (the left lingual gyrus and the left occipital pole)
brain, we first mapped the contribution of SEEG stimulation current were the second group of candidates that could belong to the EZN.
to brain source activity. We retrieved the contribution from a pair of The heatmap projected on the patient’s T1-MRI revealed the spatial
electrodes, in which the perturbation is applied to the brain regions mapping of the EZN (sagittal, axial and coronal view images shown
based on the sensor-to-source mapping matrix¹⁵. Then we calculated in Fig. 3e). The spatial mapping of these three regions in 3D brain is
the effect of the bipolar pulse stimulation (50 Hz for a duration of 3.5 s highlighted in red and yellow in Fig. 3f.
on bipolar GL’5-6 electrode leads) on each vertex of the cortex mesh
(Fig. 3a). We used the Epileptor-Stimulation model at each of the 20,284 Virtual brain twins for TI stimulation
vertices. The stimulation leads to an accumulation in a state variable We here demonstrate how the pipeline works for TI stimulation. First,
m that pushes the brain to seize (Supplementary Fig. 2). The seizures we began with high-resolution twin modeling for this patient based

Nature Computational Science | Volume 5 | September 2025 | 754–768 757

Article https://doi.org/10.1038/s43588-025-00841-6

        a TI stimulation and b Source activity
        corresponding electric field 4,310.0 ms 4,540.0 ms 4,560.0 ms


                  High
                                                         High

    PPO3   PPO5

                      9,380.0 ms  9,980.0 ms  12,980.0 ms
    P5h    PO5h   Low
                                                         Low




c Scalp-EEG time series under TI stimulation d Distributions of EVs
E70 Left O2
E69
E68 Left O1
        Left T2 posterior
E66 Left occipital pole
E64 Left calcarine sulcus
 E61 Left STS posterior
        Left cuneus
E60 Left lingual sulcus
E57 Right O1
E56 Left-temporal pole
E54 0 0.25 0.50 0.75 1.00
        2,000 4,000 6,000 8,000 10,000 12,000 14,000 16,000 Normalized EVs
        Time in ms
     e Heatmap of EZN f Spatial map of EZN




                  Left O1

                  Left O2
    Right  Left    Right  Left


Fig. 4 | Estimating EZN from TI-stimulation-induced seizure (synthetic stimulation. Neural activity is shown in color on the cortical mesh at six
data). a, The electric field of TI stimulation by two pairs of scalp-EEG electrodes different time points. The seizures are located around the left O2 regions of
(shown in red and orange) based on the 10-5 international reference system, the VEP atlas. c, Simulated scalp-EEG time series from TI-stimulation-induced
using an extended scalp-EEG cap from SIMNIBS²⁹. We applied stimulation at seizure. The y-axis shows the names of selected scalp-EEG channels. The scaled-
1,000 Hz and 1,005 Hz through the first (PPO3, P5h) and second (PPO5, PO5h) up time series during the seizure period is shown in red. d, Posterior distribution
scalp electrode pairs, respectively. The electrodes PPO3, P5h, PPO5 and PO5h of the EVs (higher value indicates higher chance for seizure) for ten selected
are part of the extended 10–5 EEG system and correspond to intermediate scalp regions obtained from the HMC sampling. Red regions indicate highest chance
locations over the parietal and parieto-occipital regions. The spatial distribution of being the EZN; the others are in green.e,f, The region of the highest EV posterior
of the amplitude of the TI electric field is colored in the 3D brain. b, Seizure distribution is the left O2 in red shown in T1-MRI (e) and the 3D brain (f). The second
dynamics were simulated using the Epileptor-Stimulation model through the TI region (left O1) is shown in yellow.


on spontaneous seizures (Fig. 2). We calculated the TI electric field, the EZN (Fig. 4d). The heatmap of these two regions projected on the
which is projected onto the cortical surface by stimulating two pairs patient’s T1-MRI shows the spatial mapping of the EZN (sagittal, axial
of scalp-EEG electrodes (PPO3–P5h and PPO5–PO5h29 in Fig. 4a) at and coronal view images shown in Fig. 4e) and the 3D brain in Fig. 4f,
frequencies of 1,000 Hz and 1,005 Hz, respectively. The stimulation where the left O2 is in red and the left O1 in yellow.
amplitude is determined based on the assumption that the components
of the field that have the greatest impact are those that are parallel to Multimodal inference
the neurons’ axons³⁰. On the basis of the TI electric field, the stimulation For patients with multiple seizure recordings or simultaneous multiple
input is applied to the Epileptor model on each vertex of the cortical modality recordings (here we used SEEG and scalp-EEG as examples), we
mesh (Supplementary Fig. 3). We simulated the brain source signals integrate both modalities into the model inversion algorithm to combine
on each vertex of the whole brain by considering both global and local their information in the parameter estimation process and potentially
connectivity (Fig. 4b and Supplementary Video 2). We then mapped the improve clinical decision-making. Here we demonstrated two cases
activities from the vertices of the cortical surface onto the scalp-EEG in which the EZN estimation from multimodal functional recordings
signals (Fig. 4c) using the source-to-sensor mapping matrix. were integrated. The first case estimated the EZN from simultaneous
     We extracted the data features from these synthetic scalp-EEG scalp-EEG and SEEG recordings under SEEG stimulation (Fig. 5a and
recordings (Fig. 4c) as input to the HMC model inversion to estimate the Supplementary Fig. 4a). Here we mapped the same source signals to
epileptogenic zone. From the posterior distribution of EVs, we obtained both the SEEG and scalp-EEG sensors. Two key added values arise from
the left O2 as first and the left O1 as the second candidate belonging to performing simultaneous SEEG and scalp-EEG recordings. First, the

Nature Computational Science | Volume 5 | September 2025 | 754–768 758










     field (V/m)
Amplitude of electric










    activity (a.u.)
    Brain source

    Article                                                                                      https://doi.org/10.1038/s43588-025-00841-6

    a
        SEEG stimulation  TB'3-4         SEEG time series by SEEG stimulation                              Left O2        Distributions of EVs
                          GC'3-4                                                                           Left O1
                        CU'10-11                                                                Left lingual gyrus
                          CU'6-7                                                                 Left T2 posterior
                         FCA'7-8                                                               Left occipital pole
                        GL'11-12                                                             Left calcarine sulcus
                          GL'5-6                                                                Left STS posterior
                          GL'1-2                                                                       Left cuneus
                        PFG'9-10                                                               Left lingual sulcus
                           B'2-3                                                                Left temporal pole
                                     2,000      4,000       6,000                 8,000      10,000        0          0.2 0.4     0.6     0.8     1.0
                                                        Time (ms)                                                     Normalized EVs

                                     Scalp-EEG time series by SEEG stimulation
     Source activity
                             E70
                             E69
                             E68                                                                                                              Left O2
                             E66
                             E64
                             E61
                             E60
                             E57
                             E56
             at 4,645 ms     E54     2,000      4,000       6,000                 8,000      10,000
                                                        Time (ms)

    b                                                  SEEG time series by TI stimulation        Distributions of epileptogenic values
        TI stimulation
                          TB'3-4                                                                           Left O2
                          GC'3-4                                                                           Left O1
                        CU'10-11                                                                Left lingual gyrus
                          CU'6-7                                                                 Left T2 posterior
                         FCA'7-8                                                               Left occipital pole
                        GL'11-12                                                             Left calcarine sulcus
                          GL'5-6                                                                Left STS posterior
                          GL'1-2                                                                       Left cuneus
                        PFG'9-10                                                               Left lingual sulcus
                           B'2-3                                                                Left temporal pole
                                    2,000   4,000 6,000    8,000 10,000            12,000    14,000 16,000        0   0.2 0.4                     0.6  0.8 1.0
                                                           Time (ms)                                                  Normalized EVs
                                            Scalp-EEG time series by TI stimulation

        Source activity      E70                                                                                          Left STS posterior
                             E69
                             E68                                                                                          Left O2
                             E66
                             E64
                             E61
                             E60
                             E57
                             E56
        at 9,980 ms          E54    2,000  4,000  6,000   8,000  10,000 12,000     14,000    16,000
                                                          Time (ms)
    Fig. 5 | Multimodal inference for EZN estimation from simultaneous SEEG and              at the bottom left. b, We combined ictal recordings from SEEG (middle top) and
    scalp-EEG recordings (synthetic data). a, We combined ictal recordings from              scalp-EEG (middle bottom) induced by TI stimulation (left), using multimodal
    SEEG (middle top) and scalp-EEG (middle bottom) induced by SEEG stimulation              inference to obtain the distribution of EVs (right top). The results were mapped
    (left), using multimodal inference to obtain the distribution of EVs (right top).        in three dimensions. In this case, we obtained the ground-truth left O2 in red and
    The results were mapped in the 3D brain. In this case, we obtained the ground-           additional brain region as left STS posterior in yellow. The spatial distribution of
    truth left O2 in red. The spatial distribution of source activity at 4,634 ms is shown   source activity at 9,980 ms is shown at the bottom left.


scalp-EEG provides a whole-brain sampling although it mainly measures To complement the cases, we utilized the multimodal model inver-
weak cortical surface signals in contrast to the SEEG, which samples only sion module on SEEG recordings from SEEG stimulation (Fig. 5a) and
partial brain space with relatively strong signals from deep structures scalp-EEG recording from TI stimulation (Fig. 5b) in Supplementary
as well. Second, this pipeline provides a way to evaluate the roles of the Information. The posterior of the EVs from the multimodal model
scalp-EEG so that we could design a less invasive SEEG implantation in inversion showed the left O2 as the EZN (Supplementary Fig. 4c). Notice
the future. The posterior of the EVs from a simultaneous model inver- that, in this case, the SEEG and scalp-EEG data here were not simultane-
sion showed the left O2 as the EZN (Fig. 5a). The second case estimated ously recorded. The SEEG and TI stimulation induced the seizures with
the EZN from simultaneous scalp-EEG and SEEG recordings under TI different initial conditions. Then results would be valid only with an
stimulation (Fig. 5b and Supplementary Fig. 4b). The posterior of the EVs assumption that the HMC sampled all feasible initial conditions. For
from the multimodal model inversion showed the left O2 as the EZN and comparison, in the fourth case, we pooled the posterior distributions
the left superior temporal sulcus (STS) posterior as a second candidate. of the EVs from the SEEG (in Fig. 3d under SEEG stimulation) with the

Nature Computational Science | Volume 5 | September 2025 | 754–768 759

    Article                            https://doi.org/10.1038/s43588-025-00841-6

        a      SEEG stimulation       b Source activity
  SHE             50 Hz, 3 s on             2,536 ms  5,688 ms  8,936 ms
                  bipolar PM’3-4
        a                          er.
                                   =
                                    el
   1                                   4,048 ms      6,320 ms
High-resolution spatial mapping of the stimulation        High




                                                                                                                                                    Low

                                        Low                                  High
                                    Amplitude of electric field (V/m)

        c              SEEG time series under SEEG stimulation                            d                                  Distributions of EVs
      PM'7-8
      PM'6-7                                                                               Left F1 mesial prefrontal
     PM'5-6 |                                                                             Left F1 lateral prefrontal           ;
      PM'3-4                                                                     Left F1 middle frontal sulcus {
      PM'2-3                                                                                  Left F1 lateral premotor {   |
      PM'1-2                                                                              Left orbito frontal cortex
       TP4-5                                                                                             Left preSMA
    OR'11-12                                                                                                Left SMA    |
    OR'10-11
         I'10-11 Jo                                                                               Left temporal pole
     I'10-11                                                                                                               0 0.2 0.4 0.6 0.8        1.0
                1,000  2,000 3,000  4,000 5,000 6,000 7,000                  8,000                                             Normalized EVs
                                                     Time (ms)

        E127                        Scalp-EEG time series under SEEG stimulation          e    Spatial map of EZN            Left F1 lateral prefrontal
        E120                                                                                  Left F1 mesial prefrontal
         E68
         E60
         E31
         E30                            vr                                       |
         E22                                                                                  y=
         E21
         E18
         E17                        1
                1,000  2,000 3,000  4,000 5,000 6,000 7,000                  8,000
                                    Time (ms)
    Fig. 6 | Estimating EZN from SEEG stimulation for a second patient with               with values indicated by color. c, Selected simulated SEEG time series (top) and
    frontal lobe epilepsy (synthetic data). a, Top: PM’3-4 (large blue/red sphere) is     EEG time series (bottom) from SEEG-stimulation-induced seizure. The scaled-up
    the stimulated contact in the left frontal lobe, using a bipolar pulse stimulation    time series during the seizure period are shown in red. d, Posterior distribution of
    (50 Hz for a duration of 3 s with pulse duration 1 ms). Bottom: spatial map           EVs (higher value indicates higher chance for seizure) for eight selected regions
    showing the amplitude of electric field (shown in the color bar from low (left)       obtained from the HMC sampling when analyzing simultaneously SEEG and
    to high (right) values) at each brain vertex, induced by SEEG stimulation (from       scalp-EEG. SMA, supplementary motor area. e, The highest chance of being the
    sensor PM’3-4). b, Seizure dynamics were simulated using the Epileptor-               EZN as left F1 lateral prefrontal in red mapped in the 3D brain and left F1 mesial
    Stimulation model and induced through SEEG stimulation. Neural source activity        prefrontal cortex and left-middle frontal sulcus in yellow.
    in arbitrary units (a.u.) is shown on the cortical mesh at five different time points,



EVs from the scalp-EEG (in Fig. 4d under TI stimulation). We obtained simulated neural source signals (Fig. 6b and Supplementary Video 3),
the left O2 as the intersection of the two distributions to be the only we obtained simultaneous SEEG and scalp-EEG signals (Fig. 6c) using
brain region in the EZN (Supplementary Fig. 4d). the source-to-sensor gain matrix. These synthetic SEEG and scalp-EEG
        signals during the ictal period served as input for multimodal inference
Validation of the pipeline to estimate the EZN. We obtained the left F1 lateral prefrontal cortex
To validate the pipeline, we added the results of a second patient with as the region with the highest EV from the HMC algorithm (Fig. 6d,e).
left frontal lobe epilepsy. The patient underwent resective surgery The two neighboring regions (the left F1 measial prefrontal cortex and
resulting in seizure freedom (surgery outcome class of Engel I²⁸). Eight the left-middle frontal sulcus) were identified as secondary candidates
brain regions including the orbitofrontal, anterior cingulate, F1 lateral that could belong to the EZN (Fig. 6d,e).
prefrontal, F2 rostral, superior frontal sulcus rostral, frontal pole and We also illustrated the results of this patient with TI stimulation
F1 mesial prefrontal cortices in the left hemisphere were resected. We in Extended Data Fig. 1. First, we used high-resolution modeling to
built the high-resolution whole-brain model for two types of perturba- simulate TI stimulation. We calculated the TI electric field, which is pro-
tion under the hypothesis that the left F1 lateral prefrontal cortex is the jected onto the cortical surface by stimulating two pairs of scalp-EEG
EZN. To model direct electrical stimulation by SEEG electrodes in the electrodes (FPz–AF3 and AFz–Fp1 in Extended Data Fig. 1a) at frequen-
brain, we calculated the effect of the bipolar pulse perturbation (50 Hz, cies of 1,000 Hz and 1,005 Hz, respectively. The brain source signals on
for a duration of 3 s on bipolar PM’3-4 electrode leads) (Fig. 6a). The sei- each vertex of the whole brain is shown in Extended Data Fig. 1b and
zure was induced around the left F1 lateral prefrontal cortex. From the Supplementary Video 4. We then mapped the neural activity from the

Nature Computational Science | Volume 5 | September 2025 | 754–768 760










    activity (a.u.)
    Brain source

Article https://doi.org/10.1038/s43588-025-00841-6

cortical surface onto the SEEG and scalp-EEG electrodes (Extended Data Discussion
Fig. 1c) using the source-to-sensor mapping matrix. We extracted the The first application of this pipeline can help us to answer a crucial
data features from simultaneous synthetic ictal SEEG and scalp-EEG diagnostic question: how to infer the underlying EZNs from stimulated
recordings (Extended Data Fig. 1c), which served as the input to the seizures? To answer this question, it is necessary to investigate the
multimodal inference to estimate the EZN. We obtained the left-middle following problems, illustrated in Supplementary Fig. 9. First, what
frontal cortex as the region with highest EVs from all samples (Extended is the proper range of stimulation parameters to induce seizures for
Data Fig. 1d,e). The left F1 lateral prefrontal and left orbitofrontal sul- diagnosis? Currently, no standardized stimulation protocols exist²⁰.
cus were identified as the second candidates belonging to the EZN The French guidelines suggest parameters for both low-frequency
(Extended Data Fig. 1d,e). (1 Hz) and high-frequency (50 Hz) stimulation with specified ranges on
     We next demonstrated the role of heterogeneity of local connec- pulse width, pulse intensity and stimulation duration³. Our personal-
tivity. Here, local connectivity refers to how neuronal populations at ized whole-brain model has the ability to predict the stimulation effect
different vertices are connected within a specific area or neighborhood. for individual patients given specified stimulation parameters and
We introduced such heterogeneity in local connectivity under the should be validated in future empirical studies. On the patient-specific
hypothesis that within the EZN, local connectivity increases due to syn- level, among the proper range of stimulation parameters, then what
aptic remodeling31 or the loss of inhibitory synapses³². Extended Data are the optimal stimulation parameters for inducing seizures for diag-
Fig. 2 illustrates both source-level and sensor-level SEEG and EEG signals nosis? Second, what is the relationship between the EZN triggered by
when local connectivity within the EZN is two to five times higher than stimulation and the one occurring during spontaneous seizures? More
that in other brain regions. Compared with the results obtained with specifically, we want to investigate whether the EZN estimated from
homogeneous local connectivity (Fig. 6), only minor differences were stimulation-induced seizures equals the EZN of spontaneous seizures.
observed during seizure periods. However, the neighborhood of the It could be possible that stimulation forces seizures in brain regions
EZN showed a lower mean distribution of EVs from model inference, that would not be epileptogenic otherwise, or that stimulation uncovers
making it easier to identify the EZN. only a subset of epileptogenic regions. Even for spontaneous seizures,
     Another application of the proposed pipeline is to test and miti- the limited observations of recordings of spontaneous seizures may
gate false-positive stimulation results (non-habitual seizures being also tell only part of the story. Third, how many seizures induced by
triggered) through a carefully designed protocol and optimized simu- SEEG stimulation are sufficient for identifying the full underlying EZN?
lation and stimulation parameters. Here we systematically evaluated We can investigate this question by systematically evaluating the EZNs
the effects of stimulation in terms of stimulation locations in two set- on SEEG-stimulation-induced seizures generated by virtual brain twin
tings. (1) Within-electrode stimulation (PM’): stimulating all pairs of models with given EZNs. The proposed VEP-stimulation pipeline with
electrode leads within the same electrode using identical stimulation high-resolution modeling provides a reasonable framework to address
parameters (Supplementary Fig. 5). (2) Distributed cortical stimula- all these questions.
tion: stimulating ten additional SEEG bipolar pairs implanted in ten The diagnostic pipeline for TI stimulation can provide a theoretical
different cortical regions (Supplementary Fig. 6). Our simulations basis for non-invasive diagnosis and treatment of epilepsy. TI stimula-
demonstrated that stimulation does not induce seizures in healthy tion is a good candidate for both diagnosis and treatment in epilepsy
regions. The theoretical basis for this lies in the seizure threshold within the non-invasive stimulation family. Other non-invasive stimula-
of each region, which is directly related to its epileptogenicity. The tion techniques, such as tDCS³⁵, are mostly used for treatment only in
EZN has a lower seizure threshold compared with healthy regions. epilepsy. The key feature of TI stimulation is that it enables a focal stim-
This parameterization ensures that weak stimuli—based on clinically ulation that can reach deep brain structures non-invasively21,36, such as
applied stimulation parameters—can trigger seizures in the EZN but the hippocampus, which quite often is involved in the EZN in temporal
not in healthy tissue. lobe epilepsy. TI stimulation has evoked seizure-like events in the
     The choice of atlas is an important topic in neuroscience stud- mouse hippocampus that have been experimentally well controlled³⁷
ies, specifically for whole-brain network studies, and should be and strategies exist to replicate high-suprathreshold electric-field
aligned with the specific research objectives. We selected the VEP values in humans³⁸. Our study presents a pipeline for predicting the use
atlas27 because it is purposefully designed for epileptology, consider- of TI in diagnosing the EZN in human epilepsy, and lays the foundation
ing both anatomical and functional features within each structure, for optimizing TI-stimulation strategies. This framework can be further
particularly in relation to EZN and surgical applications. Moreover, extended to build high-resolution, patient-specific models for future
we extended our pipeline to be easily adaptable to other atlases, therapeutic interventions.
using the Desikan–Killiany (DK) atlas33,34 as an example. We demon- To achieve non-invasive diagnosis and treatment with TI in the
strated this application using the DK atlas while maintaining the same future, we need to optimize the workflow using purely non-invasive
simulation parameters as those used for the VEP atlas, including the data. A key next step, directly building on this work, is to systematically
stimulation electric field in Supplementary Fig. 7. The simulation of estimate the EZN from scalp-EEG signals within a cohort of patients.
source activity and SEEG and scalp-EEG remains similar, particularly In the presented example, we obtained a good estimate of the EZN
in terms of spatiotemporal patterns. This is because the primary from non-invasive scalp-EEG signals, with localization in superficial
difference arises from variations in the size of the EZN and struc- cortical gray matter. Future studies should assess the robustness of
tural connectivity (Supplementary Fig. 7a–c). The forward solution the VEP across different epilepsy types and EZN locations. In addi-
remains unchanged owing to the high-resolution stimulation at the tion, the required spatial resolution (number of scalp-EEG recording
source level. However, the estimated EZN is larger in the DK atlas channels) for accurately identifying the underlying EZN needs further
because its brain regions are more extensive compared with those investigation. Another future direction is to develop a non-invasive VEP
in the VEP atlas. As an example, we examined a case where the EZN using high-resolution magnetoencephalography (MEG) data. We have
network in the superior frontal gyrus is substantially larger in the DK obtained preliminary results with ²³Na MRI39 and now need to develop
atlas than in the VEP atlas. In the VEP atlas, the superior frontal gyrus methods for VEP estimation and reconstruction from high-resolution
is subdivided into five distinct structures. EEG and MEG data. A further question is how precisely the EZN can be
     A detailed quantitative comparison of SEEG and TI stimulation identified using interictal spikes or network features from EEG and
effects—characterized by spatial distribution and activation ampli- MEG—potentially allowing seizure-inducing stimulation to be avoided.
tude—is provided in Supplementary Information section ‘Quantifica- Virtual brain twins have the capability to integrate multimodal neu-
tion of SEEG and TI stimulation effects’ and Supplementary Fig. 8. roimaging data, including anatomical recordings, such as T1-weighted

Nature Computational Science | Volume 5 | September 2025 | 754–768 761

Article https://doi.org/10.1038/s43588-025-00841-6

MRI, diffusion-weighted MRI and CT; as well as functional ones, such as Methods
scalp-EEG, MEG, SEEG, subdural grid, positron emission tomography Patient data
and functional MRI. In this work, we extend this integration by design- We used the data from two patients who underwent a standard pre-
ing a multimodal inference version of the HMC algorithm for simultane- surgical protocol at La Timone Hospital in Marseille. The first patient
ous functional recordings of SEEG and scalp-EEG⁴⁰, and can be further is a 23-year-old female diagnosed with left occipital lobe epilepsy. She
extended to other combinations, including MEG and scalp-EEG⁴¹, and underwent resective surgery and was nearly seizure-free after surgery,
SEEG and MEG⁴². Across functional recordings, the main distinction with an Engel Class II outcome. The second patient is a 19-year-old
lies in the forward solution. The usage of this multimodal inference male with left frontal lobe epilepsy. He underwent resective surgery
is also valid in cases where different recordings start with the same resulting in complete seizure freedom and an Engel Class I outcome.
brain states, or when the sampling algorithms can cover all possible Informed written consent was obtained in compliance with the ethical
initial conditions. requirements of the Declaration of Helsinki and the study protocol was
     We extended this pipeline by incorporating the capability to model approved by the local Ethics Committee (Comité de Protection des Per-
heterogeneous local connectivity in a brain region-specific manner. sonnes sud Méditerranée 1). Each patient underwent a comprehensive
Three key elements must be taken into account: (1) the specific EZN presurgical assessment, which included medical history, neuropsycho-
associated with different types of epilepsy, (2) the type of neural models logical assessment, neurological examination, fluorodeoxyglucose
applied, and (3) personalization. In virtual brain twins, local connectiv- positron emission tomography, high-resolution 3 T MRI, long-term
ity should be derived from the anatomical information, rather than scalp-EEG and invasive SEEG recordings. They received non-invasive
from functional connectivity and effective connectivity⁴³. Anatomical T1-weighted imaging (MPRAGE sequence, repetition time 1.9 s, echo
connectivity varies across different EZNs depending on the type of time 2.19 ms, voxel size 1.0 × 1.0 × 1.0 mm³) and diffusion-weighted MRI
epilepsy. For example, increased local connectivity within the EZN may images (with an angular gradient set of 64 directions, repetition time
result from enhanced excitatory synapse formation driven by axonal 10.7 s, echo time 95 ms, voxel size 1.95 × 1.95 × 2.0 mm³, b-weighting of
sprouting44,45 or from the loss of inhibitory synapses³². Conversely, neu- 1,000 s mm−2.) The images were acquired on a Siemens Magnetom Verio
ronal loss, axonal damage and synaptic pruning may reduce anatomical 3 T MR-scanner. The patients had invasive SEEG recordings obtained by
connectivity, although the exact mechanisms remain unclear⁴⁶. The implanting multiple-depth electrodes, each containing 10–18 contacts
choice of the neural activity model also has an important role in repre- 2 mm long and separated by 1.5 mm or 5 mm gaps. The SEEG signals
senting the heterogeneity of local connectivity. Our results indicate that were acquired on a 128 channel Deltamed/Natus system. After the
incorporating local connectivity heterogeneity does not substantially electrode implantation, a cranial CT scan was performed to obtain the
alter brain activity or seizure propagation when using the Epileptor location of the implanted electrodes.
model in this pipeline. The Epileptor, as a phenomenological model,
and its excitability parameter x0 already account for the coexistence Data processing
of increased excitatory connectivity and decreased inhibitory con- To construct the individual brain network models, we first preprocessed
nectivity, which reflects the hyperexcitability of epileptogenic tissue. the T1-MRI and diffusion-weighted MRI data. Volumetric segmentation
However, region-specific local connectivity may play a more important and cortical surface reconstruction were from the patient-specific
role in biophysical models47,48. Currently, personalized measurements of T1-MRI data using the recon-all pipeline of the FreeSurfer software
local connectivity are not feasible in routine clinical practice. However, package http://surfer.nmr.mgh.harvard.edu. The cortical surface was
advancements in neuroimaging techniques may provide such informa- parcellated according to the VEP atlas²⁷, the code for which is available
tion for research purposes and, in the future, for clinical applications⁴⁹. at https://github.com/HuifangWang/VEP_atlas_shared.git. The reasons
     The current pipeline has several limitations. Model-based for choosing the VEP atlas are as follows. (1) The VEP atlas is specifically
approaches are usually computationally expensive and parameter designed for epileptology, incorporating anatomical and functional
sensitive, which may pose challenges for real time use in clinical rou- features of each brain structure, particularly in relation to the EZN and
tine, such as the optimization of stimulation parameters. The current surgical applications. (2) The geometric features and sizes of the brain
pipeline does not consider the dynamics of the epileptic disorders over regions are well suited for both clinical applications and modeling,
long timescales nor the long-term effects of the stimulation. Ongoing including model inversion. (3) Brain regions can be automatically
systematic evaluations and studies will also improve the current pipe- labeled and personalized from T1-MRI scans using geometric and
line in the following ways. High-resolution modeling of the subcortical neuroanatomical information. (4) The VEP atlas has been clinically
structure and a more realistic forward resolution may improve the evaluated in a retrospective study including 53 patients, and is cur-
whole-brain modeling. The introduction of regional variations (such rently being assessed in another prospective trial with 356 patients,
as cell density and receptor density)50,51 may provide a fundamental ensuring its clinical suitability and reliability14–16. A brief summary of
way to improve the current pipeline. the steps to obtain the VEP atlas goes as follows. T1-weighted images
     The virtual brain twin concept in stimulation here can be extended are processed using FreeSurfer to remove non-brain tissue⁶⁰, segment
to other brain disorders: Parkinson’s disease52 and schizophrenia¹⁷. subcortical gray matter structures⁶¹, normalize intensity62 and generate
Studies have demonstrated the safety of TI in human participants53,54, cortical surfaces⁶³. These surfaces are inflated, registered to a spherical
and explored its application in brain disorders, such as epilepsy24,55, template and corrected for topology61,64. The cortex is then subdivided
Alzheimer’s disease⁵⁶, Parkinson’s disease57 and essential tremor⁵⁸. into regions based on gyral and sulcal structures⁶⁵, forming the basis for
For broader applications across different brain disorders, selecting an constructing the VEP atlas. This construction involves splitting, merg-
appropriate neural mass model and key parameters is a key challenge. ing and renaming operations to both cortical and subcortical regions.
Furthermore, as the choice of the right atlas matters, the pipeline illus- Cortical regions are divided based on the triangulated surface mesh,
trates the application to different atlases. The proposed pipeline can while subcortical regions are split directly on voxels. Nonlinear splits
be adapted for alternative stimulation techniques, such as deep brain are applied in specific areas with high curvature, such as the callosal
stimulation59 and other non-invasive modalities such as tDCS35 and sulcus, whereas the superior frontal gyrus is split using a combination
tACS²³. These stimulation methods are commonly used for therapeutic of linear and specialized methods based on cortical surface geometry²⁷.
interventions, and a key challenge lies in refining and adapting the mod- We used the MRtrix software package to process the
els to account for both excitatory and inhibitory effects. Furthermore, diffusion-weighted MRI⁶⁶, employing the iterative algorithm described
incorporating neuromodulation into the modeling process is crucial in ref. 67 to estimate the response functions and subsequently used
for accurately capturing these effects. constrained spherical deconvolution68 to derive the fiber orientation

Nature Computational Science | Volume 5 | September 2025 | 754–768 762

    Article                                                                                                                 https://doi.org/10.1038/s43588-025-00841-6

    distribution functions. The iFOD2 algorithm69 was used to sample                      of the slow permittivity variable z drives the system autonomously
    15 million tracts. The structural connectome was constructed by assign-               between ictal and interictal states. The parameter x0 indicates the
    ing and counting the streamlines to and from each VEP brain region.                   degree of excitability and directly controls the dynamics of the neural
    The diagonal entries of the connectome matrix were set to zero to                     population to produce seizures or not. Asm(t) plays an important role
    exclude self-connections within areas and the matrix was normalized                   in the model with stimulation, Supplementary Fig. 10 demonstrates
    so that the maximum value was equal to one. We obtained the location                  how the system behavior changes as m varies. As m increases from 0
    of the SEEG contacts from post-implantation CT scans using GARDEL                     to 1.5, which is below the threshold (mthresh = 1.8), the oscillation in the
    (Graphical user interface for Automatic Registration and Depth Elec-                  upstate changes from stable spiral to a spiral with limit cycles (Supple-
    trodes Localization), which is part of the EpiTools software package⁷⁰.               mentary Fig. 10a–d). Higher values of m correspond to larger ranges of
    Then we co-registered the contact positions from the CT scan space to                 limit cycles in both dimensions, x and z. When m = 2.0, which exceeds
    the T1-MRI scan space for this patient.                                               mthresh = 1.8, m directly influences z, pushing the system into the seiz-
                                                                                          ing state. The variable m(t) is directly related to the excitability of the
    High-resolution simulation of the Epileptor-Stimulation model                         corresponding tissues. Tissue excitability in epileptogenic networks
    We modeled epileptic seizures on a patient-specific high-resolution                   arises from a combination of factors, including ion channel dysfunc-
    brain model. There is no consensus about the precise biophysical                      tion, an imbalance between excitation and inhibition, and altered ion
    mechanism of ion exchanges that leads to seizure onset. Previous stud-                homeostasis. However, care must be taken not to overinterpret its role,
    ies have demonstrated an increase in excitability, spike frequency and                as we are working with a phenomenological model. There are two slow
    oscillation power71–74 when an external perturbation was applied. Exper-              variables, z(t) and m(t). While z drives the gradual changes underly-
    imental studies have linked seizure onset to specific changes in ion                  ing seizure initiation and termination, m increases by accumulating
    dynamics such as extracellular potassium or intracellular chloride75–77.              the stimulation effects through the influence of the electric field. As
    We hypothesized that exposure of repetitive stimulation/pertubation                   m increases, the stability of the system changes. Once m reaches the
    generates a slow accumulation effect, which can push the system to the                threshold value mₜₕᵣₑₛₕ, it directly pushes z into a state that prepares the
    seizure state when a seizure threshold is reached.                                    system to transition into a seizure state.
                           We model this accumulation effect phenomenologically via the              Each vertex i is locally connected to its neighbors through local
parameter m, which influences the oscillatory dynamics in the seizure connectivity and globally connected to other parts of the brain through
onset state in the Epileptor model78,79. We render m time dependent, global connectivity. Local connections, scaled by γlc, are described
m = m(t), and introduce an exponentially decaying memory kernel of by a translationally invariant Laplacian coupling kernel S(gi, j) where
length r through a linear ordinary differential equation, which slowly gi, j denotes the geodesic distance along the cortical mesh between
builds up when an external stimulus is applied until the seizure thresh- vertices i and j. The cortical mesh incorporates personalized geo-
old is reached. In the absence of a stimulus,m(t) slowly returns back to metric features of the cortical surface derived from an individual’s
baseline.His the Heaviside function. When m is greater than the seizure T1-MRI. Global connections, scaled by γgc, along white matter fibers,
threshold mₜₕᵣₑₛₕ, the H function equals 1, which kicks the system into are represented by the connectome matrix, where Wk,l denotes the con-
    the seizure-like state. Otherwise, the H function equals 0.                           nection strength between brain areas k and l. Each vertex i is assigned
                        The pial surfaces of both hemispheres define the spatial domain   to a brain area k = 1, …, L according to a cortical parcellation. For this
    along which the network activity can unfold. Neural dynamics are gov-                 study, we used the VEP parcellation. The average neural activity Xl of
    erned by an extension of the original Epileptor model²⁶. The extended                 all vertices belonging to area l is coupled throughout the network and
    Epileptor-Stimulation model includes a stimulation-accumulating                       projected uniformly to all vertices of area k. The default parameters of
    state variable m that can destabilize the system and produce a seizure.               the system are Iext = 3.1, c = 1, d = 5, r = 1, a = 1, n = 1, mthresh = 1.8, γgc = 0.1,
    The neural activity at every vertex i = 1, …, N of the network is governed            γlc = 0.8, θgc = −1, and θlc = − 1. The time-varying input Istim describes
    by the following equations:                                                           the perturbation signal in each time step depending on stimulation
               xi  = yi − f1(xi) − zi + Iext + Istim                                      parameters. To accomplish this, we computed the generated electric
                                                                                          field from the two types of perturbation (1) an invasive SEEG stimula-
                      +γlc ∑N S( gi, j)H(x j, θlc) + γgc ∑L           Wk,lH(Xl, θgc)̇     tion and (2) a non-invasive TI stimulation. These are described in two
                           j=1                 l=1                                        separate subsections below.
               yi  = c − dx2i − yi                                                  (1)   Calculation of the electric field of SEEG stimulation
               zi  = r(4(xi − x0 + nH(mi − mthresh)) − zi) + f2(zi)̇                      The SEEG stimulation is applied to a pair of neighboring sensors, in
        mi = r(Istim − mi)                                                                which one acts as a cathode and the other one as an anode. This gener-
                                                                                          ates a bipolar pulse perturbation in the area where the electrodes are
                                                                                          located. The parameters used clinically are restricted to frequencies of
    where:                                                                                either 1 Hz or 50 Hz, weak amplitudes ranging from 0.1 mA to 3 mA, and
                                                                                          pulse widths of 0.5–3 ms. In this paper, we used a frequency of 50 Hz,
                                  ax3 − bx2                           if xi  < 0
                  f   (xi) = {        i        i                                          an amplitude of 3 mA, a pulse width of 2 ms, and a stimulation dura-
                   1              −(mi + 0.6(zi − 4)2)xi              if xi  ≥ 0          tion of 3.5 s and 3 s. The stimulus signal, ψ, is a waveform represented
                                                                                          here as a biphasic pulse train of electrical current. The electric-field
                  f2(zi) = { −0.1z0        7i      ifif zizi <≥ 00                  (2)   strength at each vertex depends on the distance between vertices
                                                                                          and the stimulated pair of bipolar electrode leads. Shorter distances
                                  1        if x ≥ θ                                       result in higher field strengths. To simplify, we identified the maximal
               H(x, θ) = {                                                                field strength within each brain region and uniformly applied it to all
                                  0,       if x < θ                                       vertices within that region, as shown at the bottom of Figs. 3a and 6a.
                   S(x) =  2 1    e−|x|                                                   We defined the Istim at each vertex as ψ × electric-field strength at this
                                                                                          vertex, with an example shown in Supplementary Fig. 2. Please note that
                                                                                          the effects of the stimuli on brain signals are dependent on multiple
    The state variables x and y describe the activity of neural populations               factors, including the nonlinearity of local dynamics, local and global
    on a fast timescale and can model fast discharges. The oscillation                    connections, and the stimulation current.

    Nature Computational Science | Volume 5 | September 2025 | 754–768                        763

Article                                                                                                          https://doi.org/10.1038/s43588-025-00841-6

Calculation of the electric field of the TI stimulation                       network model. The resulting gain matrix has dimensions M × N, with
Non-invasive stimulation with TI is a recent method that aims to mimic        M being the number of regions and N the number of sensors.
deep brain stimulation’s capabilities to be both focal and subcorti-                        Matrix multiplication of the simulated source activity with the
cal without being invasive. This is done using the assumption that            gain matrix yielded the simulated SEEG signals, that is, SEEGₖ(t) = ∑j
higher kilohertz stimulation frequencies have an ignorable effect on          gj,kxj(t), where xj(t) is the time series of the source-level signals. This
neuronal activity21,36. To obtain the distribution of the TI field in the     distance-based approach and the summation of all the vertices within
gray matter, we started by computing the electric-field distribution          each region neglect the orientation of the underlying current dipoles.
from the simulation of tDCS via SimNIBS⁸⁰. First, we reprocessed the          Pyramidal neurons, which are oriented normal to the cortical sur-
individual T1-weighted MRI via the SimNIBS process ‘mri2mesh’, which          face, are assumed to be the physiological source of any electric signal
resulted in the segmentation into five head tissues: white and gray           recorded with SEEG, scalp-EEG or MEG⁸². The direction of the dipolar
matters, cerebrospinal fluid, skull and scalp. This process creates the       momentum associated with the NMM at typical spatial resolutions
tetrahedral meshes necessary for the finite element method for the            of 10–20 cm2 in virtual brain networks of 100–200 nodes²⁷. However,
simulation of the electric-field distribution. We computed the tDCS           approaches that use high-resolution representations of the network,
field for each pair of electrodes positioned based on the location of         allowing for the computation of a surface orthogonal, have this abil-
the co-registered 128 electrodes scalp-EEG cap, using the 10-5 system.        ity. To solve the forward problem, we followed the analytical solution
Circular electrodes with a diameter of 10 mm and a thickness of 5 mm          proposed in ref. 83 for electric fields in an unbounded homogeneous
were directly applied on the head. Then, we projected these electric          medium. This choice of forward model assumes no boundary effects
fields onto the resampled Freesurfer surface (20,484 vertices). We            of changes of conductivity at tissue boundaries. A previous study has
extracted the amplitude of the electric field at each vertex of the           shown that the error of an unbounded homogeneous conductivity
cortex surface. These fields derived from the coupled electrodes              model compared with a more accurate finite element method model
pairs were projected onto the normal of the cortical surface, then            with changes in conductivity is relatively small for electric fields gener-
modulated by multiplying them with two sinusoids with frequencies             ated by dipoles deep in the brain and electrodes close to the source⁸⁴.
of 1,000 Hz and 1,005 Hz, respectively, for 1 s. Two oscillatory electric     Therefore, we can estimate the gain matrix elements gi,k approach by
fields, which were linearly summed, provided an interference field.
To obtain a correct representation of the high-frequency activity,            gi,k = ai/(4πσ)Q ⋅ (rk − ri)/(|rk − ri|3)
the sampling rate was 30 kHz. We extracted the 5 Hz peak envelope
by using spline interpolation. Finally, we included this envelope in          where rk and ri are the position vectors of sensor k and source vertex
the virtual brain model as the source of external simulation for the          i, respectively. ∣v∣ represents the L2 norm of a vector v. Q is the dipole
cortex vertices (20,484).                                                     orientation vector and σ is the electric conductivity. As we assume
For example, for patient 1, we targeted the highest TI stimulation            constant conductivity across the brain, it becomes merely a scaling
effect on the left O2 in the VEP atlas²⁷. We used the optimization pro-       factor, which we set to σ = 1.
cess in SimNIBS to identify the best 4 electrodes configurations (10-5
scalp-EEG montage), which maximized the electric field in the left O2.        Forward solution for scalp-EEG signals
This procedure allowed us to identify, in our case, PPO3–PPO5 and             To compute the forward solution of scalp-EEG signals, we first recon-
P5h–PO5h (ref. 29) as the best electrode couple for the left O2 stimula-      structed three individual surfaces (inner skull, outer skull and head)
tion. Thus obtained electric-field strengths ranged up to 0.48 V m−1 at       of the patient based on boundary element models using Brainstorm⁸⁵.
the cortical target sites, consistent with previously published empirical     Then in Brainstorm, we co-registered the scalp-EEG electrodes posi-
and simulation studies24,54. These field strengths are probably too weak      tions (of the Hydrocel E1 128 channels electrode cap) onto the head
to induce seizures in biological tissue. Nonetheless, future advance-         surface, according to the fiducial points of the patient’s T1-MRI. We
ments in multipolar TI—using more than two electrode pairs—could              applied a slight manual correction to better orient the scalp-EEG
enable the generation of stronger, more focal electric fields at target       cap to the individual anatomy. Finally, we derived an scalp-EEG for-
locations while maintaining low applied electric currents38,81. For our       ward model using a 3-shell boundary element model (conductivity,
demonstration cases, we rescaled the amplitude of the stimulus signal         0.33 S m−1, 0.165 S m−1, 0.33 S m−1; ratio, 1/20)86 and the OpenMEEG
to be able to induce seizures in the phenomenological Epileptor model         method implemented in Brainstorm87,88, to provide a realistic head
and used it as an input to the Istim parameter. A simulated time series of    model. Then we obtained a gain value for each dipole (20,484 vertices),
one selected vertex from the EZN is shown in Supplementary Fig. 3.            with the constrained direction normal to the cortex surface, for each
                                                                              scalp-EEG electrode. Finally, the gain matrix derived from the head
Forward solution for SEEG signals                                             model was multiplied by the simulated time series of the brain sources
The forward solution for the SEEG signals maps the neural activity            to obtain the scalp-EEG activity, that is, EEGₗ(t) = ∑jgᴱᴱᴳx j(t), where gᴱᴱᴳ
                                                                                  j,l  j,l
from the sources to the sensors (SEEG contacts), represented by a             from the source signal on brain region j to the EEG signal on channel l.
source-to-sensor matrix (gain matrix). As sources for our model,
we used the vertices of the pial surface for the cortical regions, and        Calculation of the SEEG and scalp-EEG data features
each subcortial region as a single node as in the neural mass model           We extracted the data features from the SEEG and scalp-EEG signal
(NMM). Surfaces are represented as triangular meshes. For the NMM,            to be the input of the model inversion modules. The SEEG data were
we defined the mapping gj,k from the source brain region j to the sensor      re-referenced using a bipolar montage, which was obtained using the
k as the sum of the inverse of the squared Euclidean distance di,k from       difference between two neighboring contacts on one electrode. The
vertex i to sensor k, weighted by the area ai of the vertex on the surface.   two-dimensional Epileptor model, introduced below, is suitable for
                             N j                                              fitting the envelope of the seizure time series. Ideally, the envelope
    g j     = ∑ ai/d 2                                                        follows a slightly smoothed rectangular function from the onset until
    ,k                       i=0     i,k                                      the offset of the seizure. To get a well-formed target that our model
                                                                              should fit, we extracted the bipolarized SEEG signal from 10 s before
Here vertex i belongs to region j which has Nj vertices in total. The         the seizure onset until 10 s after the seizure offset. We identified the
area ai of vertex i was obtained by summing up one-third of the area          outlier time points that were greater than two times the standard devia-
of all the neighboring triangles. Vertices belonging to the same brain        tion of the extracted signal and replaced them with the mean of the
region were summed to obtain the gain for a single region of our brain        extracted signal. The signal was then high-pass filtered with a cut-off at

Nature Computational Science | Volume 5 | September 2025 | 754–768                     764

    Article                                                                                                     https://doi.org/10.1038/s43588-025-00841-6

10 Hz to remove slow signal drifts. The envelope was calculated using a Calculation of the EVs
sliding-window approach with a window length of 100 time points. The Using the HMC model inversion algorithm, we obtained the estimated
signal inside the window was squared, averaged and log-transformed. source time series, and based on these, we calculated brain
From the resulting envelope, we again identified and removed outli- region-specific EVs. We checked the source time series (variable x of
ers, as described above. Finally, the envelope was smoothed using a the two-dimensional Epileptor in equation (3)) of region i for values
lowpass filter with a cut-off of 0.05 Hz. The mean across the first few above a threshold of 0. The first occurrence of such a value is consid-
seconds of the envelope was used to calculate a baseline, which was ered to be the onset of the seizure ti in that region. We define
then subtracted from the envelope. The same procedure was used for t = min(ti), i = 1, … , 162 . Brain regions with no estimated seizure
        0
the EEG data, the only difference being that we used absolute values for (no values above 0) are assigned an onset value ti = 200. The EVi for
the gain matrix, to get the accumulated effect on each EEG electrode brain region i is calculated as EVi = −log(((ti − t₀) + 1)/20). Then we nor-
    throughout the entire seizure.                                               malized the EV vector to [0, 1] for each sample and plotted the distribu-
                                                                                 tion of EVs.
    The HMC model inversion
    By taking advantage of timescale separation and using averaging meth-        Reporting summary
    ods, the Epileptor can be reduced to a two-dimensional system⁸⁹:             Further information on research design is available in the Nature
               xi     = I1 − x3i − 2x2i − zi                                     Portfolio Reporting Summary linked to this article.
               zi     = (1/τ0) (4(xi − xi,0) − zi + K ∑N Ci, j(x j − xi))  (3)   Data availability
                                            j=1                                  The data used in this work are available via Code Ocean: the compute
                                                                                 capsules can be accessed via https://doi.org/10.24433/CO.3316132.v1
    where τ0 scales the length of the seizure. The external input is defined     (ref. 92; part 1) and https://doi.org/10.24433/CO.2143670.v1 (ref. 93;
    as I1 = 3.1. We used the two-dimensional Epileptor for the model inver-      part 2). These data include a patient’s preprocessed anatomical infor-
    sion, that is, the parameter estimate of the model, from the scalp-EEG       mation and high-resolution functional simulation data, which can be
    and SEEG recordings.                                                         used for relevant calculations and simulations presented in this paper.
             For the individual SEEG model inversion, the forward solution is:   The patient raw datasets cannot be made publicly available due to
    SEEGₖ(t) = ∑jgj,kxj(t). For the individual scalp-EEG model inversion, the    the data protection concerns regarding potentially identifying and
    forward solution is: EEGₗ(t) = ∑    gEEGx j(t).                              sensitive patient information. Interested researchers may access the
                                        j     j,l                                datasets by contacting the corresponding authors and F.B. (Fabrice.
              For the multimodal model inversion, we projected the same source
    signals to the scalp-EEG and SEEG at the same time while we calculated       BARTOLOMEI@ap-hm.fr). Source data for Figs. 2–6 and Extended Data
    the likelihood according to the HMC algorithm, that is, SEEGₖ(t) =           Figs. 1 and 2 are available with this paper.
    ∑jgj,kxj(t); EEGₗ(t) = ∑jgᴱᴱᴳx j(t).
                          j,l                                                    Code availability
     For the model inversion, we applied the No-U-Turn Sampler
(NUTS), an adaptive variant of the HMC algorithm to sample the pos- The code used in this work is available via Code Ocean: part 1,
terior density of the model parameters. The performance of the HMC https://doi.org/10.24433/CO.3316132.v1 (ref. 92); part 2, https://doi.
is highly sensitive to the step size and number of steps in the leapfrog org/10.24433/CO.2143670.v1 (ref. 93); The codes are also available via
integrator for updating the position and momentum variables in a GitHub at https://github.com/HuifangWang/VBT_INS_Stimulation.git.
Hamiltonian dynamic simulation⁹⁰. We used NUTS, which is imple-
mented in Stan and extends HMC with adaptive tuning of both the step References
size and the number of steps in a leapfrog integration to sample effi- 1. Bartolomei, F. et al. Defining epileptogenic networks: contribution
    ciently from the posterior distributions90,91. To overcome the ineffi-        of SEEG and signal analysis. Epilepsia 58, 1131–1147 (2017).
ciency in the exploration of the posterior distribution of the model 2. Katz, J. S. & Abel, T. J. Stereoelectroencephalography versus
    parameters, we used a reparameterization of the model parameters              subdural electrodes for localization of the epileptogenic zone:
    based on the map function from the model configuration space to the           what is the evidence? Neurotherapeutics 16, 59–66 (2019).
observed measurements¹⁰. Our reparameterization-based approach 3. Isnard, J. et al. French guidelines on
    reduces the computation time by providing more effective sample               stereoelectroencephalography (SEEG). Neurophysiol. Clin. 48,
    sizes and removing divergences by exploring the posterior distribu-           5–13 (2018).
tions of the linear combinations of regional parameters that represent 4. Jehi, L. et al. Comparative effectiveness of stereotactic
    the eigenvectors obtained from the singular value decomposition of            electroencephalography versus subdural grids in epilepsy
    the gain matrix. We denote the matrix of the eigenvectors of GᵀG as V         surgery. Ann. Neurol. 90, 927–939 (2021).
and the new parameters as x∗i,0 = Vᵀxi,0 and zi(t₀)∗ = Vᵀzi(t₀). We ran the 5. Bartolomei, F., Chauvel, P. & Wendling, F. Epileptogenicity of
    model inversion on both empirical and simulated seizures with 16              brain structures in human temporal lobe epilepsy: a quantified
    chains starting from 8 optimized initial conditions. The eight optimized      study from intracerebral EEG. Brain 131, 1818–1830 (2008).
initial conditions are the output of MAP estimation algorithm¹⁵. We ran 6. Grinenko, O. et al. A fingerprint of the epileptogenic zone in
    the MAP estimation algorithm 50 times and selected the best 8 results         human epilepsies. Brain 141, 117–131 (2018).
in terms of the likelihood. We assessed model identifiability based on 7. Proix, T., Bartolomei, F., Guye, M. & Jirsa, V. K. Individual brain
    an analysis of posterior samples, which demonstrated that the sampler         structure and modelling predict seizure propagation. Brain 140,
    explores all the modes in the parameter space efficiently. The analysis       641–654 (2017).
includes trace plots (evolution of parameter estimates from draws over 8. Sip, V. et al. Data-driven method to infer the seizure
    the iterations), pair plots (to identify collinearity between variables)      propagation patterns in an epileptic brain from intracranial
    and autocorrelation plots (to measure the degree of correlation               electroencephalography. PLoS Comput. Biol. 17, e1008689
    between draws of samples). Sampling convergence of the algorithms             (2021).
was assessed by estimating the potential scale reduction factor and 9. Hashemi, M. et al. The Bayesian virtual epileptic patient: a
    calculating the effective sample size based on the samples of the pos-        probabilistic framework designed to infer the spatial map of
    terior distributions, providing estimates of the efficient run times of       epileptogenicity in a personalized large-scale brain model of
    the algorithm.                                                                epilepsy spread. NeuroImage 217, 116839 (2020).

    Nature Computational Science | Volume 5 | September 2025 | 754–768                765

Article                                                                                      https://doi.org/10.1038/s43588-025-00841-6

10.   Jha, J., Hashemi, M., Vattikonda, A. N., Wang, H. & Jirsa, V. Fully          31.   Bod, R. et al. Synaptic alterations and neuronal firing in human
      Bayesian estimation of virtual brain parameters with self-tuning                   epileptic neocortical excitatory networks. Front. Synaptic
      Hamiltonian Monte Carlo. Mach. Learn. Sci. Technol. 3, 035016                      Neurosci. 15, 1233569 (2023).
      (2022).                                                                      32.   Kumar, S. S. & Buckmaster, P. S. Hyperexcitability, interneurons,
11.   David, O., Woźniak, A., Minotti, L. & Kahane, P. Preictal short-term               and loss of gabaergic synapses in entorhinal cortex in a model of
      plasticity induced by intracerebral 1 Hz stimulation. NeuroImage                   temporal lobe epilepsy. J. Neurosci. 26, 4613–4623 (2006).
      39, 1633–1646 (2008).                                                        33.   Desikan, R. S. et al. An automated labeling system for subdividing
12.   Friston, K. J. On the modelling of seizure dynamics. Brain 137,                    the human cerebral cortex on MRI scans into gyral based regions
      2110–2113 (2014).                                                                  of interest. NeuroImage 31, 968–980 (2006).
13.   Jirsa, V. et al. The virtual epileptic patient: individualized               34.   Zhao, Y. et al. The brain structure, immunometabolic and genetic
      whole-brain models of epilepsy spread. NeuroImage 145, 377–388                     mechanisms underlying the association between lifestyle and
      (2017).                                                                            depression. Nat. Ment. Health 1, 736–750 (2023).
14.   Makhalova, J. et al. Virtual epileptic patient brain modeling:               35.   Sudbrack-Oliveira, P. et al. Transcranial direct current stimulation
      relationships with seizure onset and surgical outcome. Epilepsia                   (tDCS) in the management of epilepsy: a systematic review.
      63, 1942–1955 (2022).                                                              Seizure 86, 85–95 (2021).
15.   Wang, H. E. et al. Delineating epileptogenic networks using                  36.   Grossman, N. Modulation without surgical intervention. Science
      brain imaging data and personalized modeling in drug-resistant                     361, 461–462 (2018).
      epilepsy. Sci. Transl. Med. 15, eabp8982 (2023).                             37.   Missey, F. et al. Orientation of temporal interference for
16.   Jirsa, V. et al. Personalised virtual brain models in epilepsy. Lancet             non-invasive deep brain stimulation in epilepsy. Front. Neurosci.
      Neurol. 22, 443–454 (2023).                                                        15, 633988 (2021).
17.   Wang, H. E. et al. Virtual brain twins: from basic neuroscience to           38.   Acerbo, E., Botzanowski, B., Missey, F. & Williamson, A. Deep brain
      clinical use. Natl Sci. Rev. 11, nwae079 (2024).                                   stimulation system. US patent (2024) US20180256896A1.
18.   Trebuchon, A. et al. Electrical stimulation for seizure induction            39.   Azilinon, M. et al. Brain sodium MRI-derived priors support
      during seeg exploration: a useful predictor of postoperative                       the estimation of epileptogenic zones using personalized
      seizure recurrence? J. Neurol. Neurosurg. Psychiatry 92, 22–26                     model-based methods in epilepsy. Netw. Neurosci. 8, 673–696
      (2021).                                                                            (2024).
19.   Oderiz, C. C. et al. Association of cortical stimulation-induced             40.   Koessler, L. et al. Catching the invisible: mesial temporal source
      seizure with surgical outcome in patients with focal drug-resistant                contribution to simultaneous eeg and seeg recordings. Brain
      epilepsy. JAMA Neurol. 76, 1070 (2019).                                            Topogr. 28, 5–20 (2015).
20.   George, D. D., Ojemann, S. G., Drees, C. & Thompson, J. A.                   41.   Dubarry, A.-S. et al. Simultaneous recording of MEG, EEG and
      Stimulation mapping using stereoelectroencephalography:                            intracerebral eeg during visual stimulation: from feasibility to
      current and future directions. Front. Neurol. https://doi.                         single-trial analysis. NeuroImage 99, 548–58 (2014).
      org/10.3389/fneur.2020.00320 (2020).                                         42.   Badier, J. M. et al. Technical solutions for simultaneous MEG and
21.   Grossman, N. et al. Noninvasive deep brain stimulation via                         SEEG recordings: towards routine clinical use. Physiol. Meas. 38,
      temporally interfering electric fields. Cell 169, 1029–1041.e16                    N118–N127 (2017).
      (2017).                                                                      43.   Friston, K. J. Functional and effective connectivity: a review. Brain
22.   San-juan, D. et al. Transcranial direct current stimulation in                     Connect. 1, 13–36 (2011).
      epilepsy. Brain Stimul. 8, 455–464 (2015).                                   44.   Buckmaster, P. S., Zhang, G. F. & Yamawaki, R. Axon sprouting
23.   Daoud, M. et al. Stereo-EEG based personalized multichannel                        in a model of temporal lobe epilepsy creates a predominantly
      transcranial direct current stimulation in drug-resistant epilepsy.                excitatory feedback circuit. J. Neurosci. 22, 6650–6658 (2002).
      Clin. Neurophysiol. 137, 142–151 (2022).                                     45.   Esclapez, M., Hirsch, J. C., Ben-Ari, Y. & Bernard, C. Newly formed
24.   Acerbo, E. et al. Focal non-invasive deep-brain stimulation with                   excitatory pathways provide a substrate for hyperexcitability
      temporal interference for the suppression of epileptic biomarkers.                 in experimental temporal lobe epilepsy. J. Comp. Neurol. 408,
      Front. Neurosci. https://doi.org/10.3389/fnins.2022.945221 (2022).                 449–460 (1999).
25.   Missey, F. et al. Non-invasive temporal interference stimulation             46.   Bernard, C. Alterations in synaptic function in epilepsy. in Jasper’s
      of the hippocampus suppresses epileptic biomarkers in patients                     Basic Mechanisms of the Epilepsies 4th edn (eds Noebels, J.
      with epilepsy: biophysical differences between kilohertz and                       et al.) 1–16 (NCBI, 2012); https://www.ncbi.nlm.nih.gov/books/
      amplitude modulated stimulation. Preprint at medRxiv https://doi.                  NBK98161/
      org/10.1101/2024.12.05.24303799 (2025).                                      47.   Wendling, F., Bartolomei, F., Bellanger, J. J. & Chauvel, P.
26.   Jirsa, V. K., Stacey, W. C., Quilichini, P. P., Ivanov, A. I. & Bernard, C.        Interpretation of interdependencies in epileptic signals using a
      On the nature of seizure dynamics. Brain 137, 2210–2230 (2014).                    macroscopic physiological model of the eeg. Clin. Neurophysiol.
27.   Wang, H. E. et al. VEP atlas: an anatomic and functional human                     112, 1201–1218 (2001).
      brain atlas dedicated to epilepsy patients. J. Neurosci. Methods             48.   Depannemaecker, D., Ezzati, A., Wang, H., Jirsa, V. & Bernard,
      348, 108983 (2021).                                                                C. From phenomenological to biophysical models of seizures.
28.   Wieser, H. G. et al. Proposal for a new classification of outcome                  Neurobiol. Dis. 182, 106131 (2023).
      with respect to epileptic seizures following epilepsy surgery.               49.   Palombo, M., Ligneul, C., Hernandez-Garzon, E. & Valette, J. Can
      Epilepsia 42, 282–286 (2008).                                                      we detect the effect of spines and leaflets on the diffusion of brain
29.   Oostenveld, R. & Praamstra, P. The five percent electrode                          intracellular metabolites? NeuroImage 182, 283–293 (2018).
      system for high-resolution EEG and ERP measurements. Clin.                   50.   Amunts, K. et al. BigBrain: an ultrahigh-resolution 3D human brain
      Neurophysiol. 112, 713–719 (2001).                                                 model. Science 340, 1472–1475 (2013).
30.   Kabakov, A. Y., Muller, P. A., Pascual-Leone, A., Jensen, F.                 51.   Zilles, K. & Amunts, K. Cytoarchitectonic and
      E. & Rotenberg, A. Contribution of axonal orientation to                           receptorarchitectonic organization in broca’s region and
      pathway-dependent modulation of excitatory transmission                            surrounding cortex. Curr. Opin. Behav. Sci. 21, 93–105 (2018).
      by direct current stimulation in isolated rat hippocampus. J.                52.   Angiolelli, M. et al. The virtual Parkinsonian patient. npj Syst. Biol.
      Neurophysiol. 107, 1881–1889 (2012).                                               Appl. 11, 40 (2025).

Nature Computational Science | Volume 5 | September 2025 | 754–768                           766

    Article                                                                                  https://doi.org/10.1038/s43588-025-00841-6

    53.   Zhang, Y. et al. Temporal interference stimulation targeting             74.   Valentin, A. et al. Single pulse electrical stimulation for
          right frontoparietal areas enhances working memory in healthy                  identification of structural abnormalities and prediction of seizure
          individuals. Front. Hum. Neurosci. 16, 918470 (2022).                          outcome after epilepsy surgery: a prospective study. Lancet
    54.   Violante, I. R. et al. Non-invasive temporal interference electrical           Neurol. 4, 718–726 (2005).
          stimulation of the human hippocampus. Nat. Neurosci. 26,                 75.   Fröhlich, F., Bazhenov, M., Iragui-Madoz, V. & Sejnowski, T. J.
          1994–2004 (2023).                                                              Potassium dynamics in the epileptic cortex: new insights on an
    55.   Davis, P. & Gaitanis, J. Neuromodulation for the treatment of                  old topic. Neuroscientist 14, 422–433 (2008).
          epilepsy: a review of current approaches and future directions.          76.   Lillis, K. P., Kramer, M. A., Mertz, J., Staley, K. J. & White, J. A.
          Clin. Ther. 42, 1140–1154 (2020).                                              Pyramidal cells accumulate chloride at seizure onset. Neurobiol.
    56.   Buss, S. S., Fried, P. J. & Pascual-Leone, A. Therapeutic noninvasive          Dis. 47, 358–366 (2012).
          brain stimulation in Alzheimer’s disease and related dementias.          77.   Trevelyan, A. J., Graham, R. T., Parrish, R. R. & Codadu, N. K.
          Curr. Opin. Neurol. 32, 292–304 (2019).                                        Synergistic positive feedback mechanisms underlying seizure
    57.   Grossman, N., Okun, M. S. & Boyden, E. S. Translating temporal                 initiation. Epilepsy Curr. https://doi.org/10.1177/15357597221127163
          interference brain stimulation to treat neurological and                       (2022).
          psychiatric conditions. JAMA Neurol. 75, 1307 (2018).                    78.   Houssaini, K. E., Ivanov, A. I., Bernard, C. & Jirsa, V. K. Seizures,
    58.   Schreglmann, S. R. et al. Non-invasive suppression of essential                refractory status epilepticus, and depolarization block as
          tremor via phase-locked disruption of its temporal coherence.                  endogenous brain activities. Phys. Rev. E 91, 2–6 (2015).
          Nat. Commun. 12, 363 (2021).                                             79.   Houssaini, K. E., Bernard, C. & Jirsa, V. K. The Epileptor model:
    59.   Gonzalez-Martinez, J. et al. Thalamocortical hodology to                       a systematic mathematical analysis linked to the dynamics of
          personalize electrical stimulation for focal epilepsy. Preprint at             seizures, refractory status epilepticus, and depolarization block.
          Research Square https://doi.org/10.21203/rs.3.rs-5507011/v1 (2024).            eNeuro 7, ENEURO.0485–18.2019 (2020).
    60.   Ségonne, F. et al. A hybrid approach to the skull stripping              80.   Saturnino, G. B. et al. SimNIBS 2.1: a comprehensive pipeline
          problem in MRI. NeuroImage 22, 1060–1075 (2004).                               for individualized electric field modelling for transcranial brain
    61.   Fischl, B. et al. Sequence-independent segmentation of magnetic                stimulation. Brain Hum. Body Model. https://doi.org/10.1007/
          resonance images. NeuroImage 23, S69–S84 (2004).                               978-3-030-21293-3_1 (2019).
    62.   Sled, J., Zijdenbos, A. & Evans, A. A nonparametric method for           81.   Botzanowski, B. et al. Focal control of non-invasive deep brain
          automatic correction of intensity nonuniformity in MRI data. IEEE              stimulation using multipolar temporal interference. Bioelectron
          Trans. Med. Imaging 17, 87–97 (1998).                                          Med. https://doi.org/10.1186/s42234-025-00169-6 (2025).
    63.   Segonne, F., Pacheco, J. & Fischl, B. Geometrically accurate             82.   Buzsáki, G., a Anastassiou, C. & Koch, C. The origin of extracellular
          topology-correction of cortical surfaces using nonseparating                   fields and currents—EEG, ECoG, LFP and spikes. Nat. Rev.
          loops. IEEE Trans. Med. Imaging 26, 518–529 (2007).                            Neurosci. 13, 407–20 (2012).
    64.   Fischl, B., Sereno, M. I. & Dale, A. M. Cortical surface-based           83.   Sarvas, J. Basic mathematical and electromagnetic concepts
          analysis: II: inflation, flattening, and a surface-based coordinate            of the biomagnetic inverse problem. Phys. Med. Biol. 32,
          system. Neuroimage 9, 195–207 (1999).                                          11 (1987).
    65.   Destrieux, C., Fischl, B., Dale, A. & Halgren, E. Automatic              84.   Caune, V. et al. Evaluating dipolar source localization feasibility
          parcellation of human cortical gyri and sulci using standard                   from intracerebral SEEG recordings. NeuroImage 98, 118–133
          anatomical nomenclature. NeuroImage 53, 1–15 (2010).                           (2014).
    66.   Tournier, J.-D. et al. MRtrix3: a fast, flexible and open software       85.   Tadel, F., Baillet, S., Mosher, J. C., Pantazis, D. & Leahy, R. M.
          framework for medical image processing and visualisation.                      Brainstorm: a user-friendly application for MEG/EEG analysis.
          NeuroImage 202, 116137 (2019).                                                 Comput. Intell. Neurosci. 2011, 1–13 (2011).
    67.   Tournier, J.-D., Calamante, F. & Connelly, A. MRtrix: diffusion          86.   Goncalves, S. et al. In vivo measurement of the brain and
          tractography in crossing fiber regions. Int. J. Imaging Syst.                  skull resistivities using an EIT-based method and realistic
          Technol. 22, 53–66 (2012).                                                     models for the head. IEEE Trans. Biomed. Eng. 50, 754–767
    68.   Tournier, J.-D., Calamante, F. & Connelly, A. Robust determination             (2003).
     of the fibre orientation distribution in diffusion MRI: non-negativity 87. Gramfort, A., Papadopoulo, T., Olivi, E. & Clerc, M. OpenMEEG:
          constrained super-resolved spherical deconvolution. NeuroImage                 opensource software for quasistatic bioelectromagnetics.
          35, 1459–1472 (2007).                                                          Biomed. Eng. Online 9, 45 (2010).
69. Tournier, J.-D., Calamante, F. & Connelly, A. Improved probabilistic 88. Kybic, J. et al. A common formalism for the integral formulations
          streamlines tractography by 2nd order integration over                         of the forward EEG problem. IEEE Trans. Med. Imaging 24, 12–28
          fibre orientation distributions. In Proc. International Society                (2005).
          for Magnetic Resonance in Medicine https://cds.ismrm.org/                89.   Proix, T., Bartolomei, F., Chauvel, P., Bernard, C. & Jirsa, V. K.
          protected/10MProceedings/PDFfiles/1670_4298.PDF (2010).                        Permittivity coupling across brain regions determines seizure
    70.   Villalon, S. M. et al. EpiTools, a software suite for presurgical brain        recruitment in partial epilepsy. J. Neurosci. 34, 15009–15021
          mapping in epilepsy: intracerebral EEG. J. Neurosci. Methods 303,              (2014).
          7–15 (2018).                                                             90.   Hoffman, M. D. & Gelman, A. The No-U-Turn Sampler: adaptively
    71.   Chang, W.-C. et al. Loss of neuronal network resilience precedes               setting path lengths in Hamiltonian Monte Carlo. J. Mach. Learn.
          seizures and determines the ictogenic nature of interictal                     Res. 15, 1593–1623 (2014).
          synaptic perturbations. Nat. Neurosci. 21, 1742–1752 (2018).             91.   Betancourt, M. A conceptual introduction to Hamiltonian Monte
    72.   Rich, S., Chameh, H. M., Lefebvre, J. & Valiante, T. A. Loss of                Carlo. Preprint at https://arxiv.org/abs/1701.02434 (2018).
          neuronal heterogeneity in epileptogenic human tissue impairs             92.   Wang, H. E., Dollomaja, B. & Triebkorn, P. Virtual brain twins
          network resilience to sudden changes in synchrony. Cell Rep. 39,               for stimulation in epilepsy (Part 1) [source code]. CodeOcean
          110863 (2022).                                                                 https://doi.org/10.24433/CO.3316132.v1 (2025).
    73.   Valentin, A. Responses to single pulse electrical stimulation            93.   Wang, H. E., Dollomaja, B. & Triebkorn, P. Virtual brain twins
          identify epileptogenesis in the human brain in vivo. Brain 125,                for stimulation in epilepsy (Part 2) [source code]. Code Ocean
          1709–1718 (2002).                                                              https://doi.org/10.24433/CO.2143670.v1 (2025).

    Nature Computational Science | Volume 5 | September 2025 | 754–768                       767

Article https://doi.org/10.1038/s43588-025-00841-6

Acknowledgements Correspondence and requests for materials should be addressed to
We thank M. Guye for providing the patient’s anatomical data and Huifang E. Wang or Viktor Jirsa.
F. Missey for the helpful discussions on TI stimulation. This work
was funded through the EU’s Horizon Europe Programme under Peer review information Nature Computational Science thanks
grant number 101147319 (EBRAINS 2.0; V.J.) and number 101137289 Arpan Banerjee, Nir Grossman and Dipanjan Roy for their contribution
(Virtual Brain Twin; V.J.), the Amidex Recherche Blanc under grant to the peer review of this work. Peer reviewer reports are available.
number AMX-22-RE-AB-135 (HR-VEP; H.E.W.), and agence Nationale Primary Handling Editor: Ananya Rastogi, in collaboration with the
de la Recherche under France 2030 bearing the reference ANR- Nature Computational Science team.
24-RRII-0005 (NAUTILUS; V.J.), on funds administered by Inserm.
Author contributions Reprints and permissions information is available at
        www.nature.com/reprints.
V.J., H.E.W. and F.B. conceived of the study. H.E.W. and V.J. formulated
and developed the methodology and provided funding acquisition. Publisher’s note Springer Nature remains neutral with regard to
H.E.W., B.D., G.M.D., P.T. and J.-D.L. developed the algorithms and jurisdictional claims in published maps and institutional affiliations.
workflow, wrote the original draft and created visualizations. H.E.W.,
B.D., P.T., G.M.D., A.W., J.M. and J.-D.L. performed the data analysis. Open Access This article is licensed under a Creative Commons
All authors contributed to the editing and revision of the paper. Attribution 4.0 International License, which permits use, sharing,
Competing interests adaptation, distribution and reproduction in any medium or format,
        as long as you give appropriate credit to the original author(s) and the
V.J., B.D., P.T., H.E.W. and A.W. hold a patent related to the technology source, provide a link to the Creative Commons licence, and indicate
and methods discussed in this article: A method and system if changes were made. The images or other third party material in this
for estimating an epileptogenic zone network: European Patent article are included in the article’s Creative Commons licence, unless
EP23169009.0. indicated otherwise in a credit line to the material. If material is not
Additional information included in the article’s Creative Commons licence and your intended
        use is not permitted by statutory regulation or exceeds the permitted
Extended data is available for this paper at use, you will need to obtain permission directly from the copyright
https://doi.org/10.1038/s43588-025-00841-6. holder. To view a copy of this licence, visit http://creativecommons.
        org/licenses/by/4.0/.
Supplementary information The online version contains supplementary
material available at https://doi.org/10.1038/s43588-025-00841-6. © The Author(s) 2025










    Nature Computational Science | Volume 5 | September 2025 | 754–768    768

Article                                        https://doi.org/10.1038/s43588-025-00841-6

    a        Tl stimulation and                b Source activity
           corresponding electric field        1840 ms        4280 ms

             yi» 2                             2160 ms        5340 ms

            EF 4                                                     High
           £19                             High
           Fp
                 4                                                   Low
                                           Low




                                      Tl stimulation                                   d  Distributions of epileptogenic values
    C    SEEG time series under

  wre
                                                                                 Left-F1-mesial-prefrontal|
   ne                                                                          — Left-Middle-frontal-sulcus        El
   ss                                                                                                                  i
  ess                                                                            Left-Orbito-frontal-cortex |      mi
   je                                                                                  Left-F1lateral-premotor |   |
  nnn                             =                                                                LeftSMA|        |
orion                                                                                   Left-Temporal-pole|        |
   no                                                                                       Go                      02          0s os 10
         Tow    E00    WW     40          600    Tam  8000
                                   Scalp-EEG time series under Tl stimulation’ "" ™                                Left-Middle-frontal-sulcus.
                                                                                       @ Spatial map of EZN

                                                                                  |
 aun]
   wl                                                                             |                                3
   ps
   of                                                                                                              8
   el                                                                                     gs?                      0
   al                                                                             |                         5
   ea                             lpm                                                                                  ERY
                                                                                  |         >                          2

         1000   2000   3000   4000 5000   6000  7000  8000     9000

                                                                         time in ms
Extended Data Fig. 1 | Estimating EZN from TI stimulation for a second                  cortical mesh at 4 different time points. c Selected synthetic SEEG time-series
patient with frontal lobe epilepsy (synthetic data). a The electric field of TI         (top) and scalp-EEG time-series (bottom) from TI stimulation-induced seizure.
stimulation by two pairs of scalp-EEG electrodes (shown in red and orange). We          The scaled-up time series during the seizure period are shown in red. d Posterior
applied a frequency of 1000 and 1005 Hz for the first and second electrode pairs,       distribution of the EV (higher value indicates higher chance for seizure) for 8
respectively. The Spatial distribution of the peak activity of the TI envelope is       selected regions the same as Fig. 6d. e The highest chance of being the EZN as
colored on the 3D brain. b Seizure dynamics were simulated using the Epileptor-         left-middle-frontal-sulcus in red mapped in 3D brain and left-F1-lateral-prefrontal
Stimulation model through the TI stimulation. Neural activity is shown on the           and left-orbito-frontal-cortex in yellow.










Nature Computational Science

Article  https://doi.org/10.1038/s43588-025-00841-6

a Source activity

EZ _  1  EZ _  EZ
=e  tie”   _  1  EZ _
=  =e  HighJ

4048ms   6320ms  |  4048ms  6320 ms  6320ms   |
II  1I   h

I  1
I  1
|  1
I  1  Low
bo  em fe) em
time series under SEEG stimulation  |"   €  SEEG time series under SEEG stimulation
|
|  .


  py     — aaron

  as)                                        ol
  P12]                                       |                       -


    on)                  ee                                                                  1     on
        000              2000          4000      5000  7000 8000                             |       100 2000                                     soo   6000  7000  8000
                                                                                  timeinms   |                                                        time in ms
                                              Scalp-EEG time series under SEEG stimulation   |     Scalp-EEG time series under SEEG stimulation
   a2        es
    eo                                                                                       |     em

    o
    £0        Ii                                                                                       1
    >                                                                                                                                     billuyA
    or                                   il                                                  lo                                               Im               -
    a0
        260                     3005    114    1S000  ll
                                                     6000 700time8600in  ms                  i       1000 200                      3000   4000 5000     000 7000    8000
                                                                                                                                                      time in         ms
        Distributions of epileptogenic values                                                1       Distributions of epileptogenic values
                                                                                             1
   Left-F1-lateral-prefrontal                                            I                   1    Left-F1-lateral-prefrontal                                           1
   Left-F1-mesial-prefrontal {     be)                                                       |                                   |
   Left-Middle-frontal-sulcus                                                                1    Left-Middle-frontal-sulcus-       1
    Left-F1-lateral-premotor ||  |                                                                      Left-F1-lateral-premotor
   Left-Orbito-frontal-cortex    |                                                           |          Leftorbitofrontal-cortex |  |
                  LeftPresMA|    |                                                           1                       LeftPresMA{    |
                     LeftSMA{    |                                                           1                         Left-SMA{    |
           Left-Temporal-pole    | ~~                                                        |                Left-Temporal-pole {  |
                                 oo     02         04  0s 08     10                          |         oo                                 02      os      06    08    10
  Extended Data Fig. 2 | The effect of increasing local connectivity within EZNs                  b. When γEZ = 2γlc, selected simulated SEEG time-series (top) and EEG time-series
                                                                                                     lc
  under SEEG stimulation as shown in Fig. 6. a Snapshot of source activity                        (middle) from SEEG stimulation-induced seizure. The scaled-up time series
  (corresponding videos available in the Supplementary Information) at two                        during the seizure period are shown in red. Posterior distribution of EVs (bottom)
  specified time instants for comparison when the local connectivity within EZN                   from the HMC sampling are shown when analyzing simultaneously SEEG and
  γEZlc  is r times the local connectivity γlc of other brain regions with r = 2, 3, 4, 5.        scalp-EEG. c Same as b, but under the condition γEZlc = 5γlc.










  Nature Computational Science

    nature portiolio   Corresponding author(s):    Huifang Wang and Viktor Jirsa     :
                       Last updated by author(s):  May 10, 2025                      o>





        ©
Nature Portfolio wishes to improve the reproducibility of the work that we publish. This form provides structure for consistency and transparency
in reporting. For further information on Nature Portfolio policies, see our Editorial Policies and the Editorial Policy Checklist. 3





Statistics
For all statistical analyses, confirm that the following items are present in the figure legend, table legend, main text, or Methods section.

    n/a | Confirmed

        The exact sample size (n) for each experimental group/condition, given as a discrete number and unit of measurement

           A statement on whether measurements were taken from distinct samples or whether the same sample was measured repeatedly

           The statistical test(s) used AND  whether they     are one- or two-sided
           Only common tests should be described solely by name; describe more complex techniques in the Methods section.

           A description of all covariates tested

           A description of any assumptions or corrections, such as tests of normality and adjustment for multiple comparisons

        A full description of the statistical parameters including central tendency (e.g. means) or other basic estimates (e.g. regression coefficient)
        AND variation (e.g. standard deviation) or associated estimates of uncertainty (e.g. confidence intervals)

 XI For null hypothesis testing, the test statistic (e.g. , t, r) with confidence intervals, effect sizes, degrees of freedom and P value noted
        Give P values as exact values whenever suitable.

        For Bayesian analysis, information on the choice of priors and Markov chain Monte Carlo settings

           For hierarchical and complex designs, identification of the appropriate level for tests and full reporting of outcomes

           Estimates of effect sizes (e.g. Cohen's d, Pearson's r), indicating how they were calculated

                                                 statistics
                                          Our web collection on  forbiologists contains articles on many of the points above.

    Software and code

    Policy information about availability of computer code

     Data collection   Siemens Magnetom Verio 3T MR-scanner for T1-weighted imaging and    diffusion  MRI images, Deltamed/Natus system for SEEG recordings.

     Data analysis     Freesurfer 6.  3.0: Used for volumetric segmentation and cortical surface reconstruction; https://surfer.nmr.mgh.harvard.edu/fswiki/
        DownloadAndinstall
        Cortical surface parcellation: https://github.com/HuifangWang/VEP_atlas_shared.git
        Mrtrix 0.3.16 software package for processing DW-MRI data. https://mrtrix.readthedocs.io/en/0.3.16/
        GARDEL 1.0 (Graphical user interface for Automatic Registration and Depth Electrodes Localization) for location of the SEEG contacts from
        post-implantation CT scans. https://meg.univ-amu.fr/doku.php?id=epitools:gardel
                       SIMNIBS 4.0:   Used for electric field       https://simnibs.github.io/simnibs/build/html/index.html
                       Brainstorm3:Forward solution for scalp-EEG signals; https://neuroimage.usc.edu/brainstorm/Installation#Requirements

For manuscripts utilizing custom algorithms or software that are central to the research but not vet described in published literature, software must&be made available to editors and
                                                                                                                     software    for     further information.  5
reviewers. We strongly encourage code deposition in 2 community repository (e.g. GitHub). See the Nature Portfolio guidelines for submitting code










                                                                                                                             1

    Data                                                                                                                                                              =

    Policy  information about availability of data
    All  manuscripts must include a data availability statement. This statement should provide the following information, where applicable:                           I]
         -  Accession codes, unique identifiers, or web links for publicly available datasets                                                                         EY
         -  A description of any restrictions on data availability                                                                                                    =
    - For clinical datasets or third party data, please ensure that the statement adheres to our policy

                                                                                                                                                                      @
    This work involves two types of data: raw clinical data, including T1-MRI and DWI-MRI images, CT scans, and SEEG data. The raw data are available upon request,   <3
 but they are not central to this paper. All derived data and key information for personalized modeling will be publicly available after publication.

                                                                                                                                                                      @


    Human research participants

    Policy  information about studies involving human research participants and Sex and Gender in Research                                                            2


    Reporting on sex and gender   We studied two patients:
                                  1 A 23-year-old female diagnosed with left occipital lobe epilepsy. She underwent resective surgery and was nearly seizure-
                                  free post-surgery, with an Engel Class II outcome.
                                  2 A 19-year-old male diagnosed with left frontal lobe epilepsy. He underwent resective surgery resulting in complete seizure
                                  freedom, with an Engel Class | outcome.

    Population characteristics    We have two patients:    a 23-year-old female with occipital  lobe epilepsy and a 19-year-old male with frontal lobe epilepsy.
                                  One had a surgical outcome classified as Engel Class , and the other as Engel Class Il.

    Recruitment                   We used two epilepsy patients with drug resistant focal epilepsy who underwent a standard presurgical protocol at La
        Timone hospital in Marseille. We selected these two patients to validate our workflow. Future scientific studies should
        include a broader range of epilepsy types and surgical outcomes.

    Ethics oversight              Informed written consent was obtained for all patients in compliance with the ethical requirements of the Declaration of
                                  Helsinki and the study protocol was approved by the local     Ethics Committee
                                  (Comité de Protection des Personnes sud Méditerranée 1

Note that full information on the approval of the study protocol must also be provided in the manuscript.








Please select the one below that is the best fit for your research. If you are not sure, read the appropriate sections before making your selection
x Life sciences O Behavioural & social sciences Ecological, evolutionary & environmental sciences

Fora reference copy of the document with al sections, see nature com/documents/nr-reporting-summary-flat.pdf








    All studies must disclose on these points even when the disclosure is negative.

    sample size       This is a methodology and concept paper. We selected two patients with drug-resistant focal epilepsy. These two patients have different
        diagnoses and surgical outcomes. For each patient, the dataset includes both anatomical and functional data from multiple recordings, such
        as TL-weighted MRI, CT, diffusion-weighted MRI, and multiple stereo-EEG sessions. Since this isamethodology and proof-of-concept paper
        for personalized medicine, we believe that an in-depth analysis of two patients is sufficient to demonstrate the feasibility of our approach

    Data exclusions   No data were excluded from the analyses

    Replication       The results are replicable if the same  parameters were used on the same datasets
        applied to the same datasets. Since this study focuses on personalized virtual brainThe results are replicable when the same parameters are
        twins, replication is expected during the construction of
        virtual twins or the identification of the epileptogenic zone networks in similar cases.

    Randomization     Because this study focuses on personalized medicine using patient-specific data, randomization is not necessary.                             N

    Blinding          The VEP analysis is independent of the patients’ clinical hypothesis and surgery outcomes. Blinding was not applicable in this context for   S
        several reasons. First, the study is retrospective and all clinical interventions had already been completed prior to analysis. Second, the Virtual
        Epileptic Patient (VEP) analysis is computational and data-driven, conducted independently of clinical outcomes or hypotheses. Finally, since
        the methodology relies on objective modeling of individualized brain dynamics rather than subjective interpretation, the lack of blinding does
        not compromise the validity or integrity of the results.

    Reporting for specific materials, systems and methods                       5
We require information from authors about some types of materials, experimental systems and methods used in many studies. Here, indicate whether each material,
system or method listed is relevant to your study. If you are not sure if alist item applies to your research, read the appropriate section before selecting a response.

            Materials & experimental systems   Methods             —
    n/a | Involved ;in the study               n/a | Involved  in  the study    @
            Antibodies                                 chip-seq                 =
            Eukaryotic cell lines              IXI|[]  Flow cytometry           a
    [XI|[]  Palaeontology and archaeology              MRI-based neuroimaging
            Animals and other organisms                                         3
            clinical data

            bual   use research of concern



    Clinical data

Policy information about clinical studies
All manuscripts should comply with the ICMJE guidelines for publication of clinical research and a completed CONSORT checklist must be included with all submissions.

  Clinical trial registration Itis not a clinical trial. The clinical data is being used for a research study.

     Study protocol           The goal  of the study is to                             develop and evaluate the VEP high-resolution workflow for stimulation.  VEP is a personalized workflow, so
        focal epilepsy, each with different diagnoses and surgical outcomes. Using these
        we selected two patients with drug-resistant
        data, we built personalized whole-brain models. These models can predict the effects of stimulation and can be further
        used to better estimate epileptic networks.

     Data collection          For each  patient, the dataset includes  both anatomical and functional data from multiple recordings, such as T1-weighted MRI, CT,
                              diffusion-weighted MRI, and multiple stereo-EEG sessions.

     Outcomes                 The VEP models can predict the effects of stimulation and can be further used to better estimate                                 epileptic networks.

    Magnetic resonance imaging

    Experimental design
     Design type                         No functional     MRI data was recorded, only                               structural and diffusion weighted images.

     Design specifications               Not used.

     Behavioral performance measures    | Not used.

    Acquisition

     Imaging type(s)                     presurgical T1 weighted MRI, presurgical diffusion weighted MRI, post SEEG     implantation CT scan

     Field strength                      3 Tesla


     Sequence & imaging parameters       MPRAGE sequence, repetition time = 1.9 or 2.3 s, echo time = 2.19 or 2.98 ms, voxel                                   size 1.0 mm3, FoV full head
                                         CT scans FoV full head, voxel size around 0.4mm * 0.4mm * 0.6mm

     Area of acquisition                 Whole brain scan

     Diffusion MRI     X used            Not used

                Parameters   Either single shell, b-values =           64 directions or multi-shell, b-values = 0, 1400, 1800), 200 directions, no cardiac gating used                    =

    Preprocessing                                                                                                                                                                         5

     Preprocessing software         Freesurfer v6, FSL v6, MRtrix 0.3.16
     Normalization                  No spatial normalization was used  in this study as all processing, modeling and inference is done in the imaging space of each
                                    individual patient.                    T1, diffusion and CT images.
                                    Only a linear registration was performed to align   between patient specific

 Normalization template           Not used.

 Noise and     artifact removal   T1 weighted was processed using   the recon-all pipeline from Freesurfer.                           Zz
                                  Diffusion    weighted MRI was processed using the functionality of the MRtrix software package.     @

 Volume censoring                 No volume censoring performed.                                                                      Q

Statistical    modeling & inference
 Model type and settings          Not used.                                                                                           3
 Effect(s)  tested                Not used.                                                                                           2
 Specify                                                                                                                              «
     type of analysis:     [| Whole brain     ROl-based      Both                                                                     @
 Statistic  type  for inference   Not used.
 (See Eklund et al.   2016                                                                                                            @

 Correction                       Not used.

Models & analysis

 n/a | Involved  in   the study

            Functional and/or effective connectivity

            Graph analysis

            Multivariate modeling or predictive analysis










                                                                                                                                      4
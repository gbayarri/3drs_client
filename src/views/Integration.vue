<template>
  <div class="main container" id="integration-content">
    <h1>{{ header }}</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel class="p-shadow-2 p-mb-3" id="header-help">
      <template #header>
          <i class="fas fa-code"></i> <div class="p-panel-title">{{ header }}</div>
      </template>
      <div class="p-grid">
        <div class="p-col">

            <h2>3dRS, a web-based tool to share interactive representations of 3D biomolecular structures and Molecular Dynamics trajectories</h2>

            <p><strong>Genís Bayarri <sup>1</sup> , Adam Hospital <sup>1*</sup> , Modesto Orozco <sup>1,2*</sup></strong></p>

            <p><sup>1</sup> Institute for Research in Biomedicine (IRB Barcelona), The Barcelona Institute of Science and
            Technology (BIST), Barcelona 08028, Spain</p>
            
            <p><sup>2</sup> Departament de Bioquímica i Biomedicina, Facultat de Biologia, Universitat de Barcelona,
            Barcelona 08028, Spain</p>
            
            <p><strong>* Correspondence:</strong><br>
            Corresponding Authors<br>
            <a href="mailto:adam.hospital@irbbarcelona.org">adam.hospital@irbbarcelona.org</a>, <a href="mailto:modesto.orozco@irbbarcelona.org">modesto.orozco@irbbarcelona.org</a></p>

            <p><strong>
                Keywords: 3D representation, Biomolecular structures, Data Sharing, Molecular Dynamics,
                Interactive Figures, FAIR.
            </strong></p>

            <h3>Abstract</h3>

            <p>3D Representation Sharing (3dRS) is a web-based tool designed to share biomolecular structure
            representations, including 4D ensembles derived from Molecular Dynamics (MD) trajectories. The
            server offers a team working in different locations a single URL to share and discuss structural data
            in an interactive fashion, with the possibility to use it as a live figure for scientific papers. The web
            tool allows an easy upload of structures and trajectories in different formats. The 3D representation,
            powered by NGL viewer, offers an interactive display with smooth visualization in modern web
            browsers. Multiple structures can be loaded and superposed in the same scene. 1D sequences from
            the loaded structures are presented and linked to the 3D representation. Multiple, pre-defined 3D
            molecular representations are available. The powerful NGL selection syntax allows the definition of
            molecular regions that can be then displayed using different representations. Important descriptors
            such as distances or interactions can be easily added into the representation. Trajectory frames can be
            explored using a common video player control panel. Trajectories are efficiently stored and
            transferred to the NGL viewer thanks to an MDsrv-based data streaming. The server design offers all
            functionalities in one single web page, with a curated user experience, involving a minimum learning
            curve. Extended documentation is available, including a gallery with a collection of scenes. The
            server requires no registration and is available at <a v-bind:href="baseURL" target="_blank">{{ baseURL }}</a>.</p>

            <h3>1 Introduction</h3>
            <p>Since Max Perutz and colleagues solved the first 3D structure of Hemoglobin using X-ray
            crystallography in 1960 [1] , macromolecular structure 3D representations have become classic
            elements in biomolecular scientific journals and scientific discussions. The constant exponential
            growth in the number of experimentally solved structures deposited in the Protein Data Bank
            database [2] (PDB) and the spectacular increase in the reliability of Molecular Dynamics (MD)
            simulations [3] , Virtual Screening (VS) techniques [4] or protein structure predictions [5, 6] generates
            the need to deal in an efficient way with structures (3D) and structural ensembles (4D models). The
            still dominant use of flat figures or predetermined videos is hampering discussion and full
            exploitation of the power of structural data.</p>

            <p>Informatics technology has evolved even faster than structural biology. Thus, current network
            bandwidths allow streaming of heavy videos at home, Central and Graphics Processing Units (CPUs,
            GPUs) are powerful enough to work with extremely demanding tasks, even in portable and small
            devices, and graphic software has improved dramatically their performance for realistic
            representations of the structural models. Some of these technologies (such as WebGL) have been
            already used for the representation of 3D structures in a common web browser [7-14] using native
            support for GPU acceleration. Web applications and online platforms have already integrated these
            tools, starting with the PDB databank, which offers the possibility to represent the uploaded
            structures with NGL [9] , Mol* [10] or JSMol. However, representation of MD simulation data is not
            as common. Although tools to automate the generation of MD videos exist [15-17] , they lack
            interactivity. In terms of web-based interactive visualizers, only some of them are able to read MD
            trajectory data (e.g. JSMol, NGL), and are restricted to a few trajectory formats. A small number of
            servers are integrating MD data visualization with different degrees of interactivity [18-21] . Luckily,
            tools such as MDsrv [22] and HTMol [23] came recently into play to facilitate this task, allowing
            streaming and visualization of MD trajectories. MDsrv accepts many different trajectory formats,
            thanks to the help of MDTraj [24] and MDAnalysis [25] software packages.</p>

            <p>However, despite all these technological advances, the practical use of 3D/4D structural images still
            implies visualization in a single computer, which means that interactivity with the structure is limited
            to a handful of scientists located in a particular laboratory. The inability to interact with 3D/4D
            structures is especially annoying when dealing with published material. Thus, conference
            proceedings and journals provide electronic copies of the papers, including pictures or in some cases
            videos of the structures. However, interactive tools are rarely used [8] (e.g.
            (<a href="https://www.elsevier.com/authors/tools-and-resources/data-visualization" target="_blank">https://www.elsevier.com/authors/tools-and-resources/data-visualization</a>),
            (<a href="https://aasnova.org/2021/02/26/aas-publishing-news-interactive-figures/" target="_blank">https://aasnova.org/2021/02/26/aas-publishing-news-interactive-figures/</a>)), and have hardly been
            applied in the context of biomolecular structural information. As a result, the reader of a scientific
            paper has to rely on the interpretation of the author of a flat image, or alternatively, retrieve the
            structure from PDB and redo the imaging in a process that might take hours or even days.</p>

            <p>Pioneering efforts towards figure interactivity have been done by different groups and consortia. The
            Interactive 3D Complements (I3DC) from Proteopedia [26] was a step forward for the incorporation
            of interactive structure visualizations as journal figures. POLYVIEW-3D [27] offered a way to create
            publication quality structure renders, as well as animated images (GIF) to be used as dynamic
            figures, and the POLYVIEW-MM [28] extension included the possibility to upload molecular
            simulation data, generating a combination of interactive visualization with structural analysis.
            Web3Dmol [14] was designed to be both an interactive protein structure visualizer and a tool to share
            interactive representations, being the first one integrating 1D sequence, measurement tools and meta-
            information. More recently, &quot;I see in 3D&quot; (iCin3D) offered a powerful macromolecular visualizer and
            editor, able to synchronize the display of 3D structure, 2D interaction, 1D sequences and annotations
            [29] . The tool is integrated in the NCBI portfolio of services, and directly connected to the Vector
            Alignment Search Tool (VAST) [30] and ClinVar [31] genomic variations database. In a similar way,
            ProSAT+ [32] and 3DBionotes [33] integrate biological annotations and structural information of
            proteins from multiple sources. 3DBionotes includes mutations, protein-protein interactions, post-
            translational modifications [34] and most recently also genomic variations [35] and SARS-CoV-2
            related annotations [36] . Although the main goal of these tools is to extract evidence relating
            sequence, structure and function using the connection with external databases annotations, they all
            also offer the possibility to save the representation in a public URL.</p>

            <p>3dRS wants to contribute to the effort started by these projects and create an interactive environment
            favoring a full exploitation of the structural information of macromolecules. It is created from our
            experience in discussing structural data between remote centers and from the problems we experience
            when reading flat structural pictures. 3dRS offers an easy and intuitive web-based Graphical User
            Interface (GUI), with a curated user experience, to generate and share interactive macromolecular 3D
            representations. 3dRS can render more than one structure at the same time. Dynamic representations
            from MD trajectories can be incorporated thanks to the integrated MDsrv module. The generated
            scene can be shared with a permanent link, contributing to the FAIR guiding principles for data
            management [37] . Besides, the shared representations can be further modified and/or expanded, using
            a fork process, following the procedure used by the GitHub software development and version
            control repository. The 3dRS server has a very intuitive use, no registration is required and is freely
            available at <a v-bind:href="baseURL" target="_blank">{{ baseURL }}</a></p>
            
            <h3>2 Method</h3>

            <p>The server is divided in two main blocks: the front-end, embodied by the online accessible web
            server; and the back-end, where all data, including the representation, structures and trajectories are
            stored and queried through REST APIs (Fig. 1).</p>
          
            <img alt="Fig. 1" src="@/assets/img/help/fig1.png">

            <p class="img-footer">Fig.1.- 3D Representation Sharing infrastructure scheme, composed of two main sections: the front-end, powered by a
            combination of VueJS, HTML5 and CSS3; and the back-end, powered by a combination of PHP-Slim REST API, MDsrv
            MD trajectory streaming server, and mongoDB NoSQL database. The back-end tools are implemented in Virtual
            Machines (VM) deployed in an OpenNebula cloud infrastructure.</p>

            <h4>2.1 Front-end</h4>
            <p>The front-end implements the web-based Graphical User Interface (GUI) offered to the end user
            (Fig.1, left). This section includes the central part of the tool, i.e. the macromolecular structure
            representation routines, powered by the NGL viewer. VueJS, an open-source JavaScript framework is
            used for the central unit of the GUI. HTML5 and CSS3 technologies accompanying NGL and VueJS
            are used to polish up the final design. The result is a seamless user experience, mimicking that of a
            native, standalone program, without page reloads or saving buttons.</p>

            <h4>2.2 Back-end</h4>
            
            <p>The back-end of the infrastructure is divided into 4 main parts (Fig.1, right):</p>

            <ul>
                <li><strong>3dRS REST API:</strong> the core programmatic interface of the platform, written using the PHP
                Slim micro framework. This API is the responsible for communicating the web server (user
                actions) with the internal database and file system.</li>
                <li><strong>MDsrv REST API:</strong> in charge of streaming MD trajectories data from the file system to the
                web-based interface. Written in Python Flask micro framework.</li>
                <li><strong>mongoDB database:</strong> is the heart of the API, where all the representations created and
                structures uploaded by the end users are efficiently stored.</li>
                <li><strong>File system:</strong> used for storing uploaded MD trajectories.</li>
            </ul>

            <p>All the important information is automatically saved to the database using the 3dRS REST API, in a
            transparent manner.</p>

            <h3>3 Modes</h3>

            <p>3dRS offers an easy, web-based 3D macromolecular representation generator that can be then shared
            and reproduced with just a URL. Thus, the tool is divided in these two main working modes: <em>edition</em>
            and <em>shared</em>. The <em>edition mode</em> is used to add representations to the molecule(s). Such representations
            can be placed by selecting molecular regions and applying NGL drawing styles. Additional
            information such as measures (distances, angles) or labels can also be included. Once the final
            representation is ready, it can be shared through a permanent link. The scene is shared as it is shown
            in the editor, keeping not just the molecular representations, but also the orientation, zoom,
            background color, measures, and labels (if added). The permanent link opens the <em>shared mode</em>, which
            allows interactive exploration of the scene, hiding the representation menus. If the author of the scene
            has enabled forking, the project can be cloned, opening the <em>edition mode</em> again and recovering all the
            representations, which allows an easy creation of new scenes by just modifications on top of already
            existing projects.</p>

            <h4>3.1 Edition Mode</h4>

            <p>3dRS edition mode is automatically opened after uploading one or more structures. It allows the
            creation of new representations with a live and interactive view of the structure(s) and the changes
            made in the central panel (Stage, Fig. 2a). Visualization tools and project settings are accessible from
            a sidebar (Tools, Fig. 2b). Available tools and settings vary depending on the working mode
            (edition/shared). New representations are added from a specific menu (Select Representation, Fig.
            2c). New representations are always linked to selections on the molecule(s), which are generated with
            a different specific menu (Selections, Fig. 2d). The final representation can be shared clicking at the
            3dRS logo button (Ready to share, Fig. 2e).</p>

            <img alt="Fig. 2" src="@/assets/img/help/fig2.png">

            <p class="img-footer">Fig.2.- 3dRS Edition Mode panels. a) Stage panel; b) Tools; c) Representations; d) Selections; e) Sharing; f) 1D Sequence.</p>

            <p>The selection of the macromolecular regions to apply different drawing styles in 3dRS is inspired by
            the Visual Molecular Dynamics (VMD) tool [38] , and is particularly powerful. Residue/Nucleotide
            sequences are opened in a new modal window (Fig. 2f), which is synchronized with the 3D
            representation and the selection panel (Fig. 2a,d). Pointing the mouse on a determined residue in the
            sequence window will highlight this residue in the representation and in the selection panel, and the
            other way around. Clicking on this residue will add it into the current selection. Segments of the
            sequence can be easily selected. To increase the selection power, a custom/manual selector is added,
            for advanced users to be able to use NGL syntax to generate complex selections.</p>

            <h4>3.2 Shared Mode</h4>
            
            <p>3dRS shared mode is opened by default when using 3dRS sharing links. It presents an interactive
            figure, a representation of a macromolecular 3D structure that can be explored in 3D, with the
            possibility to rotate, translate, zoom in/out and identify the atoms/residues/chains by just hovering on
            top of the particular molecular regions. Stage (Fig. 3a) and Tools/Settings (Fig. 3b) panels are
            maintained, with the tools bar offering different features in this case (e.g. screenshot, embed
            representation, QR code). Edition panels (Representations, Selections) are substituted here by the
            figure caption (Fig. 3c), which works exactly as the captions in scientific journals, with the
            advantages of the web, adding rich text and including external links. Finally, the sharing logo button
            has been substituted by the Forking button (Fig. 3d), giving the possibility to clone the project to
            either extend or modify it. This feature is only available if the original author of the representation
            has enabled forking on the project. In case of sharing a structure and a trajectory, an easy player is
            shown on the top of the screen (Fig. 3c). This player offers the ability of controlling the given
            trajectory in a simple way (play/pause, move frame by frame back and forward and jump to a
            concrete frame through the slider bar).</p>

            <img alt="Fig. 3" src="@/assets/img/help/fig3.png">

            <p class="img-footer">Fig.3.- 3dRS Shared Mode panels. a) Stage panel; b) Tools; c) Caption; d) Forking; e) Player.</p>

            <h3>4 Results</h3>

            <p>3dRS web platform allows the generation of shareable interactive 3D representations from a very
            easy and intuitive interface. It can load structures directly from the PDB databank (PDB code) or
            from disk (PDB file). Multiple structures can be submitted at once, with the possibility to superpose
            them once loaded. MD trajectory data can be inserted for each of the structures in the scene, with an
            efficient streaming management thanks to the integrated MDsrv tool. Measures (distances, angles)
            and labels can be easily inserted in the scene. The whole representation can be shared with just a
            permanent URL link, with the possibility to extend or modify the representation, forking the project.</p>

            <p>3dRS follows FAIR data guiding principles [37] . Representations have a globally unique and
            persistent identifier (permanent link). They are accessible using a standardized communications
            protocol (web browser). Metadata included in the representation can be used to determine the
            structure provenance (PDB, local file) and to further reproduce and extend the generated scene (fork).
            FAIR principles have been also applied in the software development process [39] . Accordingly,
            source code is available from GitHub repositories. The tool is registered in the bio.tools
            bioinformatics and Life Sciences registry [40] (<a href="https://bio.tools/3drs" target="_blank">https://bio.tools/3drs</a>). 
            Extended documentation is available from ReadTheDocs, a domain-level community standard. All the software is licensed under
            the Apache 2.0 license.</p>

            <p>Examples of what 3dRS could offer to the scientific community can be found in the project gallery
            (<a href="https://mmb.irbbarcelona.org/3dRS/gallery" target="_blank">https://mmb.irbbarcelona.org/3dRS/gallery</a>). Three of these examples have been selected to
            demonstrate the power of the tool and are described in the following sections.</p>

            <h4>4.1 Example 1 – SARS-CoV-2 Receptor Binding Domain (RBD) variants</h4>

            <p>Scientific groups around the world are devoting their efforts in the study of the SARS-CoV-2 and
            particularly in the Spike protein, a trimeric protein crucial in the virus infection and target for most of
            the current vaccines. Hundreds of studies directed to this protein are now available, a big part
            focusing on the different variants lately discovered and their impact in infectivity and vaccination
            resistance. Representations of the trimeric protein with the variants and known associated
            mutations/deletions occurring in the same lineage allow a quick identification of the location of the
            variants with respect to the main spike domains, with particular interest on the Receptor Binding
            Domain (RBD) and N-Terminal Domain (NTD), both known to contain epitopes and thus targeted
            regions of antibodies. 3dRS was used to generate a collection of interactive SARS-CoV-2
            representations, from the complete Spike protein to the insights of the recognition interface between
            RBD and the human Angiotensin Converting Enzyme 2 (hACE2) (Fig. 4).</p>

            <p>Figures 4a (<a href="https://mmb.irbbarcelona.org/3dRS/s/c1tOez" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/c1tOez</a>) and 4b
            (<a href="https://mmb.irbbarcelona.org/3dRS/s/hfS2rW" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/hfS2rW</a>) show the trimeric Spike protein representation, with
            the most important RBD variants highlighted in red, associated mutations/deletions in yellow, and
            epitopes in green. RBD region is displayed in blue color, whereas the NTD domain is displayed in
            red color. Fig 4b is showing a particular Spike conformation with one RBD region in “up” position,
            already detached from the main trimer and prepared to recognize the human cell. Figures 4c
            (<a href="https://mmb.irbbarcelona.org/3dRS/s/lQ6f21" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/lQ6f21</a>) and 4d (<a href="https://mmb.irbbarcelona.org/3dRS/s/hJxjZv" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/hJxjZv</a>)
            show a particular monomeric structure from the Spike trimer with the RBD in “up” position, attached
            to the antibody P5A-1B9 Fab (PDB code 7CZX) (Fig. 4c) and with the NTD domain attached to the
            antibody 1-87 (PDB code 7L2D) (Fig. 4d). Finally, figures 4e
            (<a href="https://mmb.irbbarcelona.org/3dRS/s/JcshuF" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/JcshuF</a>) and 4f (<a href="https://mmb.irbbarcelona.org/3dRS/s/YiGhxv" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/YiGhxv</a>)
            represent an insight on the interaction regions between the RBD/NTD and the antibodies.</p>

        </div>
      </div>
      <div class="p-grid">
        <div class="p-col"><!--<img alt="Fig. 4a" src="@/assets/img/help/fig4a.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c466b3e46963.78931227" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.4a.- SARS-CoV-2 example: spike trimeric protein</p>
        </div>
        <div class="p-col"><!--<img alt="Fig. 4b" src="@/assets/img/help/fig4b.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c46e5fba5825.76009464" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.4b.- SARS-CoV-2 example: spike with one RDB domain in “up” position</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col"><!--<img alt="Fig. 4c" src="@/assets/img/help/fig4c.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c475caa99bd2.17608420" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.4c.- SARS-CoV-2 example: spike (monomer) with P5A-1B9 Fab antibody attached to the RBD domain</p>
        </div>
        <div class="p-col"><!--<img alt="Fig. 4d" src="@/assets/img/help/fig4d.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c47a53c44f29.38290043" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.4d.- SARS-CoV-2 example: spike (monomer) with 1-87 antibody attached to the NTD domain</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col"><!--<img alt="Fig. 4e" src="@/assets/img/help/fig4e.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c481dbc19af6.80182065" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.4e.- SARS-CoV-2 example: insight of RBD-Antibodyminterface</p>
        </div>
        <div class="p-col"><!--<img alt="Fig. 4f" src="@/assets/img/help/fig4f.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c48b6fafa071.73308409" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.4f.- SARS-CoV-2 example: insight of NTD-Antibody interface</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col">
            <h4>4.2 Example 2 – SARS-CoV-2 RNA-Dependent RNA Polymerase</h4>

            <p>SARS-CoV-2 RNA-dependent RNA polymerase (RdRp) is the main protein for virus replication
            after binding to non-structural proteins (nsp) cofactors nsp7 and nsp8 to form an active complex [41] .
            Recent studies in the group [42] have shown that the RdRp reaction process is able to select the
            entering nucleotide and to catalyze its addition to a nascent RNA, following a mechanism that is
            similar to that of bacterial or eukaryotic polymerases with the transferred phosphate being stabilized
            by 2 Mg 2+ ions coordinated by acidic residues of the catalytic site, while the phosphates of the
            incoming nucleotide being stabilized by a network of basic residues [42] . In this example, the
            possibility of 3dRS to also represent breaking or formation of bonds as studied by QM/MM methods
            is showcased. 3dRS was used to generate first an interactive figure of the SARS-CoV-2 RdRp in
            which the attached cofactors and nucleotides are highlighted, introducing the 3D structure. Then, the
            process of incorporation of a natural triphosphate into a nascent RNA, exemplified by the breaking of
            a P1-O3P bond and the following formation of the P1-O3’ bond, is represented in an interactive and
            dynamic figure (Fig. 5).</p>
            
            <p>Figures 5a (<a href="https://mmb.irbbarcelona.org/3dRS/s/7Rn2Ka" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/7Rn2Ka</a>) and 5b
            (<a href="https://mmb.irbbarcelona.org/3dRS/s/TKf8yA" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/TKf8yA</a>) show the SARS-CoV-2 RdRp representations.
            Figure 5a is introducing the SARS-CoV-2 RNA-Dependent RNA Polymerase bound to its essential
            co-factors nsp7 and nsp8, whereas figure 5b is representing the reaction process involving a bond
            breaking and a new bond formation.</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col"><!--<img alt="Fig. 5a" src="@/assets/img/help/fig5a.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c20aa8325d47.86149716" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.5a.- SARS-CoV-2 RNA-Dependent RNA Polymerase (RdRp) study: interactive representation of RdRp bound to its
essential co-factors nsp7 and nsp8</p>
        </div>
        <div class="p-col"><!--<img alt="Fig. 5b" src="@/assets/img/help/fig5b.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c1ff158a6696.79962296" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.5b.- SARS-CoV-2 RNA-Dependent RNA Polymerase (RdRp) study: exploring the ability of RdRp to
incorporate a natural triphosphate into a nascent RNA</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col">
            <h4>4.3 Example 3 – Collective Variables from Coarse-Grained Conformational Transitions</h4>           
            
            <p>Large protein conformational changes are difficult to study experimentally and often not accessible
            for accurate atomistic models, forcing the use of Coarse-Grained Molecular Dynamics algorithms
            [43] . As an example, GOdMD method [44] can be used to extract relevant biophysical information to
            rationalize the protein motion, including a robust set of collective variables (CVs) capturing the
            conformational change. These CVs can then be used in more expensive and accurate calculations to
            refine the representation of the conformational transition. 3dRS allows the interactive and dynamic
            representation of some conformational transitions, highlighting the captured collective variables and
            showing the transition from trajectory data (Fig. 6).</p>

            <p>Figures 6a (<a href="https://mmb.irbbarcelona.org/3dRS/s/nDM5sO" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/nDM5sO</a>) and 6b
            (<a href="https://mmb.irbbarcelona.org/3dRS/s/QGAgYO" target="_blank">https://mmb.irbbarcelona.org/3dRS/s/QGAgYO</a>) show the conformational transitions computed with
            the GOdMD package for the D-ribose binding protein (Fig. 6a) and the Calcium Saturated Cardiac
            Troponin C (Fig. 6b), highlighting the collective variables with red dots. Distance between the atoms
            contained in the collective variables is shown as a reference.</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col"><!--<img alt="Fig. 6a" src="@/assets/img/help/fig6a.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c2586512b0a4.33959631" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.6a.- Collective variables example: D-Ribose binding protein</p>
        </div>
        <div class="p-col"><!--<img alt="Fig. 6b" src="@/assets/img/help/fig6b.png">-->
            <iframe width="100%" height="500" src="https://mmb.irbbarcelona.org/3dRS/embed/60c25dcd85ace9.59066405" title="3dRS" frameborder="0" allowfullscreen></iframe>
            <p class="img-footer">Fig.6b.- Collective variables example: calcium Saturated Cardiac Troponin C</p>
        </div>
      </div>
      <div class="p-grid">
        <div class="p-col">
            <h3>5 Discussion</h3>

            <p>3D Representation Sharing platform is a demonstration of the technical revolution in the
            biomolecular simulation field. Illustrations of biomolecular structures in scientific journals and
            conference proceeding linked for years to static, 2D figures, can be finally changed for living,
            interactive, 3-dimensional representations. This change, considered futuristic just 10 years ago, is
            now possible thanks to the fast evolution of the technology, with high-speed data transfer, greater
            connection bandwidths, efficient data storage tools as offered by NoSQL databases, and biomolecular
            visualizers able to efficiently run in common web browsers and multiple platforms and take
            advantage of new generation GPUs.</p>

            <p>3dRS emerge from our experience in discussing structural models in the context of large international
            consortia, such as BioExcel Centre of Excellence (BioExcel CoE), ELIXIR, or Human Brain Project
            (HBP), where standard imaging techniques are not able to provide the desired level of interactivity
            between the image and the groups, based in different countries. Although an image of the structure
            with measurements and labels gives a first glance of these important features, it is inevitable for a
            scientist to wonder what is happening just behind or around the interaction, unconsciously thinking in
            three dimensions. And this reaction is even stronger if the picture is presenting information coming
            from an MD flexibility analysis, where specific molecular regions are changing depending on the
            frame analyzed. Interactive figures created with 3dRS are making this possible.</p>

            <p>3dRS is to our knowledge, the only available tool making the sharing of interactive and dynamic
            3D/4D custom representations possible. It keeps the process as simple as possible, easing the
            representation generation to reach a broader scientific community, including that with a limited
            knowledge on recent technologies. Generated representations are not linked to any kind of analysis or
            external databases as found in iCn3D or 3DBionotes platforms. The scene is shown and shared as the
            author conceived it, facilitating the author to highlight the details of importance in the global
            structure, hiding of giving transparency to less important regions of the structure, making it ideal for
            scientific discussion.</p>

            <p>Quite unique of 3dRS, and also a consequence of our involvement in international consortia
            massively using atomistic simulations is the possibility to share MD trajectory data. Although limited
            in size by the web technology, the possibility to include this dynamic data is hugely increasing the
            value of the final representation. A small number of web-based servers can present 3D-interactive
            MD trajectories so far, like BigNASim [19] , or GPCRmd databases [21] (the latter relying on MDsrv
            and NGL tools as 3dRS), but still most dynamic information is kept and unshared in local computers.
            The presented platforms are designed to specifically work with local MD databases. 3dRS is opening
            these technologies so that the whole community can build and share dynamic figures representing
            MD trajectories.</p>

            <p>3dRS software is open source (Apache2 license) and can be found in:
            <a href="https://github.com/gbayarri?tab=repositories&q=3drs" target="_blank">https://github.com/gbayarri?tab=repositories&q=3drs</a>. Documentation is written using ReadTheDocs
            technology, and is available from this link: <a href="https://3drs-documentation.readthedocs.io/en/latest/" target="_blank">https://3drs-documentation.readthedocs.io/en/latest/</a>. The
            software is platform independent. It is a web-based tool, working in the most common Internet
            browser tools, although Google Chrome browser is recommended. The front-end is written as a
            Single Page Application (SPA) using VueJS, HTML5 and CSS3 technologies. The back-end is
            written with the PHP-Slim framework, with the MongoDB PHP Driver connecting to the underlying
            database, and the MDsrv server streaming MD data.</p>

            <h3>6 Conflict of Interest</h3>

            <p>The authors declare that the research was conducted in the absence of any commercial or financial
            relationships that could be construed as a potential conflict of interest.</p>

            <h3>7 Author Contributions</h3>

            <p>GB and AH contributed to the conception and design of the study. GB implemented the database,
            backend and frontend code. MO supervised the overall research. GB, AH and MO wrote the
            manuscript. All authors contributed to manuscript revision, read, and approved the submitted version.</p>

            <h3>8 Funding</h3>

            <p>This work was funded by the Spanish Ministry of Science [Grant No. RTI2018-096704-B-100], the
            Catalan SGR, the Instituto Nacional de Bioinformática; European Union’s Horizon 2020 research
            and innovation program [BioExcel-2 project, 823830], Biomolecular and Bioinformatics Resources
            Platform (Grant No. ISCIII PT 13/0001/0030) cofunded by the Fondo Europeo de Desarrollo
            Regional (FEDER) and the EU Human Brain Project Flagship as well as the MINECO Severo Ochoa
            Award of Excellence (Government of Spain). MO is an Icrea Academy Researcher.</p>

            <h3>9 Acknowledgments</h3>

            <p>The authors warmly thank Josep Lluís Gelpí (BSC) for his useful discussions, Juan Aranda for
            sharing and helping with the QM/MM trajectory example and Francesco Colizzi for generous sharing
            of the blind docking trajectory for the gallery.</p>

            <h3>10 Abbreviations</h3>

            <p>PDB, Protein Data Bank; MD, Molecular Dynamics; VM, Virtual Machine; SPA, Single Page
            Application; VS, Virtual Screening; CPU, Central Processing Unit; GPU, Graphics Processing Unit;
            WebGL, Web Graphics Library; PDF, Portable Document Format; API, Application Programming
            Language; HBP, Human Brain Project;</p>

            <h3>11 References</h3>

            <ol>
                <li>
                    Perutz, M.F., et al., <em>Structure of Hæmoglobin: A Three-Dimensional Fourier Synthesis at 5.5-
                        Å. Resolution, Obtained by X-Ray Analysis.</em> Nature, 1960. <strong>185</strong>(4711): p. 416-422.
                </li>
                <li>
                    Berman, H.M., et al., <em>The Protein Data Bank.</em> Nucleic Acids Research, 2000. <strong>28</strong>(1): p. 235-
                    242.
                </li>
                <li>
                    Hospital, A., et al., <em>Molecular dynamics simulations: advances and applications.</em> Adv Appl
                    Bioinform Chem, 2015. 10: p. 37-47.
                </li>
                <li>
                    Walters, W.P. and R. Wang, <em>New Trends in Virtual Screening</em>. J Chem Inf Model, 2020.
                    <strong>60</strong>(9): p. 4109-4111.
                </li>
                <li>
                    Zhu, L., M.D. Davari, and W. Li, <em>
                        Recent Advances in the Prediction of Protein Structural
                        Classes: Feature Descriptors and Machine Learning Algorithms.
                    </em> Crystals, 2021. <strong>11</strong>(4).
                </li>
                <li>
                    Senior, A.W., et al., <em>
                        Improved protein structure prediction using potentials from deep
                        learning.
                    </em> Nature, 2020. <strong>577</strong>(7792): p. 706-710.
                </li>
                <li>
                    Hildebrand, P.W., A.S. Rose, and J.K.S. Tiemann, <em>
                        Bringing Molecular Dynamics Simulation
                        Data into View.
                    </em> Trends Biochem Sci, 2019. <strong>44</strong>(11): p. 902-913.
                </li>
                <li>
                    Perkel, J.M., <em>
                        Data visualization tools drive interactivity and reproducibility in online
                        publishing.
                    </em> Nature, 2018. <strong>554</strong>(7690): p. 133-134.
                </li>
                <li>
                    Rose, A.S., et al., <em>NGL viewer: web-based molecular graphics for large complexes.</em>
                    Bioinformatics, 2018: p. bty419-bty419.
                </li>
                <li>
                    Sehnal, D., et al., <em>
                        Mol* Viewer: modern web app for 3D visualization and analysis of large
                        biomolecular structures.
                    </em> Nucleic Acids Res, 2021.
                </li>
                <li>
                    Sehnal, D., et al., <em>
                        LiteMol suite: interactive web-based visualization of large-scale
                        macromolecular structure data.
                    </em> Nat Methods, 2017. <strong>14</strong>(12): p. 1121-1122.
                </li>
                <li>
                    Rego, N. and D. Koes, <em>3Dmol.js: molecular visualization with WebGL.</em> Bioinformatics, 2015.
                    <strong>31</strong>(8): p. 1322-4.
                </li>
                <li>
                    Bekker, G.J., H. Nakamura, and A.R. Kinjo, <em>
                        Molmil: a molecular viewer for the PDB and
                        beyond.
                    </em> J Cheminform, 2016. <strong>8</strong>(1): p. 42.
                </li>
                <li>
                    Shi, M., J. Gao, and M.Q. Zhang, <em>
                        Web3DMol: interactive protein structure visualization
                        based on WebGL.
                    </em> Nucleic Acids Res, 2017. <strong>45</strong>(W1): p. W523-W527.
                </li>
                <li>
                    Wieczór, M., et al., <em>Molywood: streamlining the design and rendering of molecular movies.</em>
                    Bioinformatics, 2020. 36(17): p. 4660-4661.
                </li>
                <li>
                    Andrei, R.M., et al., <em>
                        Intuitive representation of surface properties of biomolecules using
                        BioBlender.
                    </em> BMC Bioinformatics, 2012. <strong>13 Suppl 4</strong>: p. S16.
                </li>
                <li>
                    Johnson, G.T., et al., <em>
                        ePMV embeds molecular modeling into professional animation software
                        environments.
                    </em> Structure, 2011. <strong>19</strong>(3): p. 293-303.
                </li>
                <li>
                    Meyer, T., et al., <em>
                        MoDEL (Molecular Dynamics Extended Library): a database of atomistic
                        molecular dynamics trajectories.
                    </em> Structure, 2010. <strong>18</strong>(11): p. 1399-409.
                </li>
                <li>
                    Hospital, A., et al., <em>
                        BIGNASim: a NoSQL database structure and analysis portal for nucleic
                        acids simulation data.
                    </em> Nucleic Acids Research, 2016. <strong>44</strong>(D1): p. D272-D278.
                </li>
                <li>
                    Zivanovic, S., et al., <em>
                        Bioactive Conformational Ensemble Server and Database. A Public
                        Framework to Speed Up.
                    </em> J Chem Theory Comput, 2020. <strong>16</strong>(10): p. 6586-6597.
                </li>
                <li>
                    Rodríguez-Espigares, I., et al., GPCRmd uncovers the dynamics of the 3D-GPCRome. Nat
                    Methods, 2020. <strong>17</strong>(8): p. 777-787.
                </li>
                <li>
                    Tiemann, J.K.S., et al., <em>
                        MDsrv: viewing and sharing molecular dynamics simulations on the
                        web.
                    </em> Nat Methods, 2017. <strong>14</strong>(12): p. 1123-1124.
                </li>
                <li>
                    Carrillo-Tripp, M., et al., <em>
                        HTMoL: full-stack solution for remote access, visualization, and
                        analysis of molecular dynamics trajectory data.
                    </em> J Comput Aided Mol Des, 2018. <strong>32</strong>(8): p.
                    869-876.
                </li>
                <li>
                    McGibbon, R.T., et al., <em>
                        MDTraj: A Modern Open Library for the Analysis of Molecular
                        Dynamics Trajectories.
                    </em> Biophys J, 2015. <strong>109</strong>(8): p. 1528-32.
                </li>
                <li>
                    Michaud-Agrawal, N., et al., <em>
                        MDAnalysis: A toolkit for the analysis of molecular dynamics
                        simulations.
                    </em> Journal of Computational Chemistry, 2011. <strong>32</strong>(10): p. 2319-2327.
                </li>
                <li>
                    Hodis, E., et al., <em>
                        Proteopedia - a scientific &#39;wiki&#39; bridging the rift between three-dimensional
                        structure and function of biomacromolecules.
                    </em> Genome Biol, 2008. <strong>9</strong>(8): p. R121.
                </li>
                <li>
                    Porollo, A. and J. Meller, <em>
                        Versatile annotation and publication quality visualization of protein
                        complexes using POLYVIEW-3D.
                    </em> BMC Bioinformatics, 2007. <strong>8</strong>: p. 316.
                </li>
                <li>
                    Porollo, A. and J. Meller, <em>
                        POLYVIEW-MM: web-based platform for animation and analysis
                        of molecular simulations.
                    </em> Nucleic Acids Res, 2010. <strong>38</strong>(Web Server issue): p. W662-6.
                </li>
                <li>
                    Wang, J., et al., <em>
                        iCn3D, a web-based 3D viewer for sharing 1D/2D/3D representations of
                        biomolecular structures.
                    </em> Bioinformatics, 2020. <strong>36</strong>(1): p. 131-135.
                </li>
                <li>
                    Berger, D.R., H.S. Seung, and J.W. Lichtman, <em>
                        VAST (Volume Annotation and Segmentation
                        Tool): Efficient Manual and Semi-Automatic Labeling of Large 3D Image Stacks.
                    </em> Front
                    Neural Circuits, 2018. <strong>12</strong>: p. 88.
                </li>
                <li>
                    Landrum, M.J., et al., <em>
                        ClinVar: improving access to variant interpretations and supporting
                        evidence.
                    </em> Nucleic Acids Res, 2018. <strong>46</strong>(D1): p. D1062-D1067.
                </li>
                <li>
                    Stank, A., S. Richter, and R.C. Wade, <em>
                        ProSAT+: visualizing sequence annotations on 3D
                        structure.
                    </em> Protein Eng Des Sel, 2016. <strong>29</strong>(8): p. 281-4.
                </li>
                <li>
                    Tabas-Madrid, D., et al., <em>
                        3DBIONOTES: A unified, enriched and interactive view of
                        macromolecular information.
                    </em> J Struct Biol, 2016. <strong>194</strong>(2): p. 231-4.
                </li>
                <li>
                    Segura, J., et al., <em>
                        3DBIONOTES v2.0: a web server for the automatic annotation of
                        macromolecular structures.
                    </em> Bioinformatics, 2017. <strong>33</strong>(22): p. 3655-3657.
                </li>
                <li>
                    Segura, J., et al., <em>
                        3DBIONOTES v3.0: crossing molecular and structural biology data with
                        genomic variations.
                    </em> Bioinformatics, 2019. <strong>35</strong>(18): p. 3512-3513.
                </li>
                <li>Macias, J.R., et al., <em>3DBionotes COVID-19 Edition.</em> Bioinformatics, 2021.</li>
                <li>
                    Wilkinson, M.D., et al., <em>
                        The FAIR Guiding Principles for scientific data management and
                        stewardship.
                    </em> 2016. <strong>3</strong>: p. 160018.
                </li>
                <li>
                    Humphrey, W., A. Dalke, and K. Schulten, <em>VMD: visual molecular dynamics.</em> J Mol Graph,
                    1996. <strong>14</strong>(1): p. 33-8, 27-8.
                </li>
                <li>Lamprecht, A.-L., et al., <em>Towards FAIR principles for research software.</em> Data Science, 2019.</li>
                <li>
                    Ison, J., et al., <em>
                        Tools and data services registry: a community effort to document
                        bioinformatics resources.
                    </em> Nucleic Acids Research, 2016. <strong>44</strong>(D1): p. D38-D47.
                </li>
                <li>
                    Kirchdoerfer, R.N. and A.B. Ward, <em>
                        Structure of the SARS-CoV nsp12 polymerase bound to
                        nsp7 and nsp8 co-factors.
                    </em> Nature Communications, 2019. <strong>10</strong>(1): p. 2342.
                </li>
                <li>
                    Aranda, J. and M. Orozco, <em>
                        RNA-Dependent RNA Polymerase From SARS-CoV-2. Mechanism
                        Of Reaction And Inhibition By Remdesivir.
                    </em> bioRxiv, 2020: p. 2020.06.21.163592.
                </li>
                <li>
                    Orozco, M., et al., <em>
                        Coarse-grained representation of protein flexibility. Foundations,
                        successes, and shortcomings.
                    </em> Adv Protein Chem Struct Biol, 2011. <strong>85</strong>: p. 183-215.
                </li>
                <li>
                    Sfriso, P., et al., <em>
                        Exploration of conformational transition pathways from coarse-grained
                        simulations.
                    </em> Bioinformatics, 2013. <strong>29</strong>(16): p. 1980-6.
                </li>
            </ol>
        </div>
      </div>
    </Panel>
  </div>
  <Footer />
</template>

<script>
import { reactive, toRefs } from "vue"
export default {
  components: {  },
  setup() {

    const header = "Integration"

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
        { label: 'Help', to: { name: 'Help'}},
        { label: 'HTML Integration', to: { name: 'Integration'}}
    ]

    const integrationPanel = reactive({
        baseURL: window.location.origin + process.env.BASE_URL
    })

    return { header, home, breadcrumbs, ...toRefs(integrationPanel) }
  }
}
</script>

<style>
    #integration-content img { max-width: 100%; }
    #integration-content .img-footer { font-size:12px; text-align: center;}

</style>
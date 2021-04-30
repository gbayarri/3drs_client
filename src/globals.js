module.exports = {
    shortName: '3dRS',
    longName: '3-dimensional structure Representation Sharing',
    aminoacids: {
        ala: { name: 'alanine', id: 'A' },
        arg: { name: 'arginine', id: 'R' },
        asn: { name: 'asparagine', id: 'N' },
        asp: { name: 'aspartic acid', id: 'D' },
        cys: { name: 'cysteine', id: 'C' },
        gln: { name: 'glutamine', id: 'Q' },
        glu: { name: 'glutamic acid', id: 'E' },
        gly: { name: 'glycine', id: 'G' },
        his: { name: 'histidine', id: 'H' },
        ile: { name: 'isoleucine', id: 'I' },
        leu: { name: 'leucine', id: 'L' },
        lys: { name: 'lysine', id: 'K' },
        met: { name: 'methionine', id: 'M' },
        phe: { name: 'phenylalanine', id: 'F' },
        pro: { name: 'proline', id: 'P' },
        ser: { name: 'serine', id: 'S' },
        thr: { name: 'threonine', id: 'T' },
        trp: { name: 'tryptophan', id: 'W' },
        tyr: { name: 'tyrosine', id: 'Y' },
        val: { name: 'valine', id: 'V' },
        da: { name: 'deoxyadenosine', id: 'DA' },
        dc: { name: 'deoxycytidine', id: 'DC' },
        dg: { name: 'deoxyguanosine', id: 'DG' },
        dt: { name: 'deoxythymidine', id: 'DT' },
        di: { name: 'deoxyinosine', id: 'DI' },
        a: { name: 'adenosine', id: 'A' },
        c: { name: 'cytidine', id: 'C' },
        g: { name: 'guanosine', id: 'G' },
        u: { name: 'uridine', id: 'U' },
        i: { name: 'inosine', id: 'I' }
    },
    representation: [
        { name: 'Backbone', id: 'backbone' },
        { name: 'Ball and stick', id: 'ball+stick' },
        { name: 'Cartoon', id: 'cartoon' },
        { name: 'Licorice', id: 'licorice' },
        { name: 'Line', id: 'line' },
        { name: 'Spacefill', id: 'spacefill' },
        { name: 'Surface', id: 'surface' },
        { name: 'Ribbon', id: 'ribbon' }
    ],
    colorScheme: [
        { name: 'Atom index', id: 'atomindex' },
        { name: 'B-factor', id: 'bfactor' },
        { name: 'Chain id', id: 'chainid' },
        { name: 'Chain index', id: 'chainindex' },
        { name: 'Element', id: 'element' },
        { name: 'Hydrophobicity', id: 'hydrophobicity' },
        { name: 'Model index', id: 'modelindex' },
        { name: 'Random', id: 'random' },
        { name: 'Residue index', id: 'residueindex' },
        { name: 'Residue name', id: 'resname' },
        { name: 'Secondary structure', id: 'sstruc' },
        { name: 'Uniform', id: 'uniform' }
    ],
    interpolation: [
        { name: 'None', id: '' },
        { name: 'Linear', id: 'linear' },
        { name: 'Spline', id: 'spline' }
    ],
    embedCode: (url) => `<iframe width="500" height="500" src="${url}" title="3dRS" frameborder="0" allowfullscreen></iframe>`
}

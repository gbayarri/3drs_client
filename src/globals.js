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
        { name: 'Hyperball', id: 'hyperball' },
        { name: 'Licorice', id: 'licorice' },
        { name: 'Line', id: 'line' },
        { name: 'Ribbon', id: 'ribbon' },
        { name: 'Rope', id: 'rope' },
        { name: 'Spacefill', id: 'spacefill' },
        { name: 'Surface', id: 'surface' },
        { name: 'Trace', id: 'trace' },
        { name: 'Tube', id: 'tube' },
    ],
    colorScheme: [
        { name: 'Atom index', id: 'atomindex', color:'#0384fc' },
        { name: 'B-factor', id: 'bfactor', color: '#fcce03' },
        { name: 'Chain id', id: 'chainid', color:'#b00505' },
        { name: 'Chain index', id: 'chainindex', color:'#b00505' },
        { name: 'Element', id: 'element', color:'#757575' },
        { name: 'Hydrophobicity', id: 'hydrophobicity', color:'#f9facd' },
        { name: 'Model index', id: 'modelindex', color:'#ff2929' },
        { name: 'Random', id: 'random', color:'#29ff5f' },
        { name: 'Residue index', id: 'residueindex', color:'#007dfa' },
        { name: 'Residue name', id: 'resname', color:'#007dfa' },
        { name: 'Secondary structure', id: 'sstruc', color:'#9600fa' },
        { name: 'Uniform', id: 'uniform', color:'#f1f1f1' }
    ],
    interpolation: [
        { name: 'None', id: '' },
        { name: 'Linear', id: 'linear' },
        { name: 'Spline', id: 'spline' }
    ],
    embedCode: (url) => `<iframe width="500" height="500" src="${url}" title="3dRS" frameborder="0" allowfullscreen></iframe>`,
    gallery: {
        development: [
            { id: '609f864ae5f988.76031858', img: 'gallery01.png' },
            { id: '609f8bf52bba88.95483112', img: 'gallery02.png' }
        ],
        staging: [
            { id: '609f864ae5f988.76031858', img: 'gallery01.png' },
            { id: '609f8bf52bba88.95483112', img: 'gallery02.png' },
            { id: '60a0170e7b9041.47453401', img: 'gallery03.png' },
            { id: '60a018efc21a50.60836011', img: 'gallery04.png' },
            { id: '60a2eb0061f600.54953893', img: 'gallery05.png' }
        ],
        production: [
            { id: '609f864ae5f988.76031858', img: 'gallery01.png' },
            { id: '609f8bf52bba88.95483112', img: 'gallery02.png' },
            { id: '60a0170e7b9041.47453401', img: 'gallery03.png' },
            { id: '60a018efc21a50.60836011', img: 'gallery04.png' },
            { id: '60a2eb0061f600.54953893', img: 'gallery05.png' }
        ]
    }
}

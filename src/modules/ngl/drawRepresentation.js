import { computed } from 'vue'

export default function drawRepresentation() {

    const addRepresentationToComponent = (representation, component, name_new, selection) => {

        const color_scheme = computed(() => representation.color_scheme !== 'uniform' ? representation.color_scheme : representation.color)
        //const color = computed(() => representation.color)

        let c1, c2
        const generatedRepresentations = []

        // OPACITY ISSUE:
        // https://github.com/nglviewer/ngl/issues/552
        // TRY TO ADD A DEPTHWRITE SELECTOR????

        switch (representation.mol_repr) {
            // in case of cartoon, add base (just in case is nucleic)
            case 'cartoon':
                c1 = component.addRepresentation( 'cartoon', { 
                  name: name_new + '-cartoon', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value,
                  color: color_scheme.value,
                  //color: color.value,
                  visible: representation.visible, 
                  opacity: representation.opacity,
                  side: 'front'
                } )
                c2 = component.addRepresentation( 'base', { 
                  name: name_new + '-base', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value,
                  color: color_scheme.value,
                  //color: color.value,
                  visible: representation.visible, 
                  opacity: representation.opacity,
                  side: 'front'
                } )
                generatedRepresentations.push(c1, c2)
              break
            case 'licorice':
                c1 = component.addRepresentation( 'licorice', { 
                  name: name_new + '-licorice', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value, 
                  color: color_scheme.value,
                  radius: representation.radius.licorice.value,
                  visible: representation.visible, 
                  opacity: representation.opacity,
                  //side: 'front'
                  //depthWrite: false
                } )
                //console.log(c1)
                generatedRepresentations.push(c1)
              break
            case 'ball+stick':
                c1 = component.addRepresentation( 'ball+stick', { 
                  name: name_new + '-ball+stick', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value, 
                  color: color_scheme.value,
                  radius: representation.radius['ball+stick'].value, 
                  visible: representation.visible, 
                  opacity: representation.opacity,
                  //side: 'front'
                  //depthWrite: false
                } )
                generatedRepresentations.push(c1)
                //console.log(name_new + '-ball+stick')
              break
            case 'backbone':
                c1 = component.addRepresentation( 'backbone', { 
                  name: name_new + '-backbone', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value, 
                  color: color_scheme.value,
                  radius: representation.radius.backbone.value,
                  visible: representation.visible, 
                  opacity: representation.opacity
                } )
                generatedRepresentations.push(c1)
              break
            case 'line':
                c1 = component.addRepresentation( 'line', { 
                  name: name_new + '-line', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value,
                  color: color_scheme.value,
                  visible: representation.visible, 
                  opacity: representation.opacity                
                } )
                generatedRepresentations.push(c1)
              break
            case 'spacefill':
                c1 = component.addRepresentation( 'spacefill', { 
                  name: name_new + '-spacefill', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value, 
                  color: color_scheme.value,
                  radius: representation.radius.spacefill.value,
                  visible: representation.visible, 
                  opacity: representation.opacity                
                } )
                generatedRepresentations.push(c1)
              break
            case 'surface':
                c1 = component.addRepresentation( 'surface', { 
                  name: name_new + '-surface', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value, 
                  color: color_scheme.value,
                  surfaceType: 'av',
                  /*contour: true,*/ 
                  visible: representation.visible, 
                  opacity: representation.opacity
                } )
                generatedRepresentations.push(c1)
              break
            case 'ribbon':
                c1 = component.addRepresentation( 'ribbon', { 
                  name: name_new + '-ribbon', 
                  ///********************************************************************* 
                  sele: selection, 
                  ///********************************************************************* 
                  //sele: '*', 
                  //colorScheme: color_scheme.value,
                  color: color_scheme.value,
                  visible: representation.visible, 
                  opacity: representation.opacity
                } )
                generatedRepresentations.push(c1)
              break
            default:
              
              break
        }

      return generatedRepresentations

    }
  
    return { addRepresentationToComponent }
  
  }
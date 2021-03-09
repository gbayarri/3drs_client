import { computed } from 'vue'

export default function drawRepresentation() {

    const addRepresentationToComponent = (representation, component, name_new, selection) => {

        const color_scheme = computed(() => representation.color_scheme === 'uniform' ? representation.color : representation.color_scheme)

        switch (representation.mol_repr) {
            // in case of cartoon, add base (just in case is nucleic)
            case 'cartoon':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'cartoon', { name: name_new + '-cartoon', sele: selection, color: color_scheme.value } )
                //component.addRepresentation( 'base', { name: name_new + '-base', sele: selection, color: color_scheme.value } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'cartoon', { name: name_new + '-cartoon', sele: '*', color: color_scheme.value } )
                component.addRepresentation( 'base', { name: name_new + '-base', sele: '*', color: color_scheme.value } )
              break
            // CHECK RADIUS FOR ALL THE POSSIBLE REPRESENTATIONS AND TAKE AN INITIAL VALUE AND A PROPER RANGE
            // TODO IN API:
            /* 
              radius: {
                licorice: {
                  value:
                  min:
                  max:
                }, backbone, ball+stick, spacefill
              }
            */
            case 'licorice':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'licorice', { name: name_new + '-licorice', sele: selection, color: color_scheme.value, radius: representation.radius } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'licorice', { name: name_new + '-licorice', sele: '*', color: color_scheme.value, aspectRatio: 1 } )
              break
            case 'backbone':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'backbone', { name: name_new + '-backbone', sele: selection, color: color_scheme.value, radius: representation.radius } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'backbone', { name: name_new + '-backbone', sele: '*', color: color_scheme.value, aspectRatio: 1 } )
              break
            case 'ball+stick':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'ball+stick', { name: name_new + '-ball+stick', sele: selection, color: color_scheme.value, radius: representation.radius } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'ball+stick', { name: name_new + '-ball+stick', sele: '*', color: color_scheme.value, radius: .4, aspectRatio: 1.6 } )
              break
            case 'line':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'line', { name: name_new + '-line', sele: selection, color: color_scheme.value } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'line', { name: name_new + '-line', sele: '*', color: color_scheme.value } )
              break
            case 'spacefill':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'spacefill', { name: name_new + '-spacefill', sele: selection, color: color_scheme.value, radius: 2 } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'spacefill', { name: name_new + '-spacefill', sele: '*', color: color_scheme.value, radius: 1.5 } )
              break
            case 'surface':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'surface', { name: name_new + '-surface', sele: selection, color: color_scheme.value, surfaceType: 'av' } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'surface', { name: name_new + '-surface', sele: '*', color: color_scheme.value, surfaceType: 'av'/*, contour: true,*/ } )
              break
            case 'ribbon':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'ribbon', { name: name_new + '-ribbon', sele: selection, color: color_scheme.value, } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'ribbon', { name: name_new + '-ribbon', sele: '*', color: color_scheme.value } )
              break
            default:
              
              break
        }

    }
  
    return { addRepresentationToComponent }
  
  }
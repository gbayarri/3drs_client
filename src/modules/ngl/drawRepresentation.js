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
            case 'licorice':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'licorice', { name: name_new + '-licorice', sele: selection, color: color_scheme.value, radius: representation.radius } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'licorice', { name: name_new + '-licorice', sele: '*', color: color_scheme.value, radius: representation.radius } )
              break
            default:
              
              break
        }

    }
  
    return { addRepresentationToComponent }
  
  }
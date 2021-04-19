import { ref } from 'vue'

const player = ref(null)
const currentFrame = ref(0)

// Stage interactions
export default function useTrajectories() {

    /*function pollDOM () {
  const el = document.querySelector('my-element');

  if (el.length) {
    // Do something with el
  } else {
    setTimeout(pollDOM, 300); // try again in 300 milliseconds
  }
}

pollDOM();*/

    /*let traj = null

    const pollTraj = () => {
        console.log(traj.trajectory.frameCount)
        if (traj.trajectory.frameCount !== 0) {
            console.log(traj.trajectory.frameCount)
            return true
        } else {
            setTimeout(pollTraj, 1000); // try again in 300 milliseconds
        }
    }*/


    /*function loop(traj){
        if(traj.trajectory.frameCount !== 0){
          return done.resolve();
        }
        setTimeout(loop(traj),300);
      }

    // code
    const checkTrajectory = async (t) => {
        /*if(!timeout){
        timeout = 2000;
        }*
        var done = new Promise();
        /*setTimeout(function(){
            done.reject();
        }, 300);*
        
        setTimeout(loop(t),300);
        
        return done.promise;
    }*/

    /*function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayedGreeting() {
  console.log("Hello");
  await sleep(2000);
  console.log("World!");
  await sleep(2000);
  console.log("Goodbye!");
}

delayedGreeting();*/

    const pollTraj = (t) => {
        return new Promise(resolve => {
            //setTimeout(resolve, ms)
            //console.log(t.trajectory.frameCount)
            /*if (t.trajectory.frameCount !== 0) {
                //console.log(t.trajectory.frameCount)
                //return true
            } else {
                setTimeout(resolve, 300); // try again in 300 milliseconds
            }*/
            if (t.trajectory.frameCount === 0) setTimeout(resolve, 300)
        })
    }


    const checkTrajectory = async (t) => {
        //traj = t
        //console.log(t.trajectory.frameCount)

        await pollTraj(t)

        return t.trajectory
        /*selection = new Selection(sel)
        //console.log('stage created')
        return selection */

        /*if (await req.isLoggedIn()) {
    // do stuff
} */
        //if(pollTraj() === true) console.log(traj.trajectory.frameCount)

        /*if (await traj) {
            console.log(traj.trajectory.frameCount)
            //return (traj.trajectory)//console.log(traj.trajectory.frameCount)
        }*/
    }

    const setTrajectoryPlayer = (p) => {
        player.value = p
    }

    const getTrajectoryPlayer = (p) => {
        return player.value
    }

    const updateCurrentFrame = (f) => {
        currentFrame.value = parseInt(f);
        /*
        // ***************************************
        // ***************************************
        if(f == (totalFrames - step)) traj.setFrame(0);
        // ***************************************
        // ***************************************
        */
    
    }

    const setCurrentFrame = (t, f) => {
        t.setFrame(f)
        updateCurrentFrame(f)
    }

    return { player, currentFrame, checkTrajectory, setTrajectoryPlayer, getTrajectoryPlayer, updateCurrentFrame, setCurrentFrame }
}
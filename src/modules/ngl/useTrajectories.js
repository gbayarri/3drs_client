import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
//import structureSettings from '@/modules/structure/structureSettings'

const player = ref(null)
const currentFrame = ref(0)

// Stage interactions
export default function useTrajectories() {

    const { projectData/*, updateStructureProject*/ } = structureStorage()
    const { updateTrajectoryData } = useAPI()
    //const { getTrajectorySettings } = structureSettings()

    const shortTimeOut = 2000
    const dataProject = computed(() => projectData.value)
    //const trajSettings = computed(() => getTrajectorySettings())
    let prjID = projectData.value._id

    // TRAJECTORY

    // when t.trajectory.frameCount !== 0, trajectory settings are fully loaded
    /*const pollTraj = (t) => {
        return new Promise(resolve => {
            console.log(t.trajectory.frameCount)
            if (t.trajectory.frameCount === 0) setTimeout(resolve, 300)
        })
    }*/

    /*const pollTraj = async (t) => {
        return new Promise(function (resolve) {
            (function waitForTraj(){
                if (t.trajectory.frameCount !== 0) return resolve()
                setTimeout(waitForTraj, 300)
            })()
        })
    }*/

    let sleep = ms => new Promise(r => setTimeout(r, ms) )
    let waitFor = async function waitFor(f){
        while(!f()) await sleep(1000)
        return f()
    }

    // check if trajectory settings are fully loaded
    const checkTrajectory = async (t) => {
        //await pollTraj(t)

        await waitFor(() => t.trajectory.frameCount > 0 )

        return t.trajectory
    }

    // PLAYER 

    // set player
    const setTrajectoryPlayer = (p) => {
        player.value = p
    }

    // get player
    const getTrajectoryPlayer = () => {
        return player.value
    }

    // update current frame
    const updateCurrentFrame = (f) => {
        currentFrame.value = parseInt(f)    
    }

    // set current frame 
    const setCurrentFrame = (t, f) => {
        t.setFrame(f)
        updateCurrentFrame(f)
    }

    // get player
    const updatePlayerSetting = (k, v) => {
        player.value.parameters[k] = v
    }

    // NGL / REST API

    const setTrajectorySettings = async (value) => {
        if(prjID === undefined) prjID = dataProject.value._id
        return await updateTrajectoryData(prjID, value)
    }

    let myTimeOut = null
    const setTrajectorySettingsTimeout = async (value) => {
        return await new Promise((resolve) => {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => {
                if(prjID === undefined) prjID = dataProject.value._id
                const response = updateTrajectoryData(prjID, value)
                resolve(response)
            }, shortTimeOut)
        })
    }

    return { 
        player, currentFrame, 
        checkTrajectory, 
        setTrajectoryPlayer, getTrajectoryPlayer,  updateCurrentFrame, setCurrentFrame, updatePlayerSetting,
        setTrajectorySettings, setTrajectorySettingsTimeout
    }
}
import { ref, reactive, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
//import structureSettings from '@/modules/structure/structureSettings'

const player = reactive([])
//const currentFrame = reactive([])
//const currentFrame = ref(0)

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

    // init player with empty value
    const setInitPlayer = (str, traj) => {
        //player.value = p
        player.push({
            str: str,
            player: null,
            frame: 0,
            autoplay: traj.settings.autoplay
        })

        /*currentFrame.push({
            str: str,
            frame: 0
        })

        console.log(currentFrame)*/
    }

    // load player
    const setTrajectoryPlayer = (p, str) => {
        //player.value = p
        /*player.push({
            str: str,
            player: p,
            currentFrame: 0
        })*/

        player.filter(item => item.str === str)[0].player = p

        /*currentFrame.push({
            str: str,
            frame: 0
        })

        console.log(currentFrame)*/
    }

    const getTrajectoryPlayer = (str) => {
        //console.log(str)
        return player.filter(item => item.str === str)[0].player
        //return player.value
    }

    // get player
    const checkPlayersLoaded = async () => {

        // if no players in project, nothing to check
        if(player.length === 0) return true

        //console.log(player[0].player)

        //await waitFor(() => player[0].player !== null )
        //await waitFor(() => player[1].player !== null )

        const array_promises = []
        for(const p of player) {
            //console.log(str.trajectory)
            array_promises
            .push(
                waitFor(() => p.player !== null )
            )
        }

        await Promise.all(array_promises)

        //console.log(player[0].player)
    }

    // play / pause all players (shared)
    const togglePlayAll = (flag) => {
        if(flag) {
            for(const p of player) {
                p.player.play()
            }
        } else { 
            for(const p of player) {
                p.player.pause()
            }
        }
    }

    const checkAutoplay = () => {
        let autoplay = false
        for(const p of player) {
            if(p.autoplay) autoplay = true
        }
        return autoplay
    }    

    // get total number of players in representation (shared)
    const getNumberOfPlayers = () => {
        return player.length   
    }

    // update current frame
    const updateCurrentFrame = (f, str) => {
        player.filter(item => item.str === str)[0].frame = f
        //currentFrame.value = parseInt(f)    
        //currentFrame.filter(item => item.str === str)[0].frame = parseInt(f)    
    }

    const getCurrentFrame = (str) => {
        return player.filter(item => item.str === str)[0].frame
        //return currentFrame.value
        //return currentFrame.filter(item => item.str === str)[0].frame
    }

    // set current frame 
    const setCurrentFrame = (t, f, str) => {
        //console.log(t, f, str)
        //console.log(player)
        const p = player.filter(item => item.str === str)[0]
        if(p) p.player.frame = f
        t.setFrame(f)
        updateCurrentFrame(f, str)
    }

    // get player
    const updatePlayerSetting = (k, v, str) => {
        //player.value.parameters[k] = v
        //console.log(player)
        //console.log(player.filter(item => item.str === str)[0])
        player.filter(item => item.str === str)[0].player.parameters[k] = v
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
        player, //currentFrame, 
        checkTrajectory, 
        setInitPlayer, setTrajectoryPlayer, getTrajectoryPlayer, checkPlayersLoaded, togglePlayAll, checkAutoplay, getNumberOfPlayers, updateCurrentFrame, getCurrentFrame, setCurrentFrame, updatePlayerSetting,
        setTrajectorySettings, setTrajectorySettingsTimeout
    }
}
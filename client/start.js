import saveManager from './savemanager'

saveManager.listSaves((res) => {
    console.log(res)
})

// TODO don't hardcode savename and seed
document.querySelector('#new-save-button').addEventListener('click', () => {
    // let exampleSeed = 56789
    // let exampleSaveName = 'my-test-example'

    saveManager.newSave((res) => {
        console.log(res)
    })
})

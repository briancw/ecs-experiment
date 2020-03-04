class SaveManager {

    listSaves(cb) {
        fetch('/list-saves')
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log(res)
            cb(res)
        })
    }

    load(saveName, cb) {
        fetch(`/saves/${saveName}`)
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            cb(res)
        })
    }

    newSave(cb) {
        fetch('/new-save?seed=56789')
        .then((res) => res.json())
        .then((res) => {
            cb(res)
        })
    }
}

export default new SaveManager()

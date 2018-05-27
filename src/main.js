const players = [
  {
    id: 'a',
    name: 'Arn',
    initials: 'AN'
  },
  {
    id: 'b',
    name: 'Bern',
    initials: 'BN'
  },
  {
    id: 'c',
    name: 'Carl',
    initials: 'CR'
  },
  {
    id: 'd',
    name: 'Don',
    initials: 'DN'
  },
  {
    id: 'e',
    name: 'Ed',
    initials: 'ED'
  },
  {
    id: 'f',
    name: 'Frank',
    initials: 'F'
  },
  {
    id: 'g',
    name: 'George',
    initials: 'G'
  },
  {
    id: 'h',
    name: 'Hazzer',
    initials: 'HZ'
  },
  {
    id: 'i',
    name: 'Ian',
    initials: 'IN'
  }
]

;(function($, $$){

  const numRows = 7
  const field = $('.field')
  const subs = $('.subs')
  const saveUrlBtn = $('.save-url-btn')
  const saveUrlInput = $('.save-url-input')
  const href = window.location.href
  const baseUrl = href.indexOf('?') < 0 ? href : href.slice(0, href.indexOf('?'))

  console.log(baseUrl)

  // generate rows and players
  generateRows()
  generatePlayers()

  // check url for code
  setUpPlayers()

  // drag set up
  const rows = Array.from($$('.row')).concat(subs)
  dragula(rows, {
    accepts: function(el, target) {
      if (target.classList.contains('gk') && target.children.length > 0) {
        return false
      }

      return true
    }
  })

  // handle save url click
  saveUrlBtn.addEventListener('click', populateUrl)

  // functions
  function populateUrl() {
    saveUrlInput.value = `${baseUrl}?code=${getCode()}`
  }

  function getChildIndex(parent, el) {
    return Array.prototype.indexOf.call(parent.children, el)
  }

  function getCode() {
    const playersList = players.reduce((playersArr, player) => {
      const item = $(`[data-blob="${player.id}"]`)
      const parent = item.parentNode
      const parentRow = parent.dataset.row
      if (parentRow) {
        playersArr.push(`${player.id}${parentRow}${getChildIndex(parent, item)}`)
      }
      return playersArr
    }, [])

    console.log(playersList)

    playersList.sort((a, b) => a.slice(1) > b.slice(1))

    return playersList.map((player) => player.slice(0,2)).join('')
  }

  function generateRows() {
    const htmlArr = []
    for (let i = 0; i < numRows; i ++) {
      const className = `row${(i < numRows - 1 ? '': ' gk')}`
      htmlArr.push(`<div data-row="${i}" class="${className}"></div>`)
    }

    field.innerHTML = htmlArr.join('')
  }

  function generatePlayers() {
    subs.innerHTML = players.map((player, index) => `<div class="blob" data-blob="${player.id}" data-name="${player.name}">${player.initials}</div>`).join('')
  }

  function setUpPlayers() {
    const query = window.location.search
    if (/^\?code=([a-z][0-9])+$/.test(query)) {
      const code = query.slice(6)
      const playersArr = []
      for (let i = 0; i < code.length; i += 2) {
        playersArr.push(code.slice(i, i + 2))
      }

      playersArr.forEach((item) => {
        const el = $(`[data-blob="${item[0]}"]`)
        const row = $(`[data-row="${item[1]}"]`)

        row.appendChild(el)
      })
    }
  }

}(document.querySelector.bind(document), document.querySelectorAll.bind(document)))
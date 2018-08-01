let tounicode = data => {
   let str = ''
   for (let i = 0; i < data.length; i++) {
      str += parseInt(data[i].charCodeAt(0), 10).toString(16) + '\\u'
   }
   return str
}
let tochinese = data => {
    data = data.split('\\u').filter(item => item !== '')
    let str = ''
    for (let i = 0; i < data.length; i++) {
      str += String.fromCharCode(parseInt(data[i], 16).toString(10))
    }
    return str
}
export {
  tounicode,
  tochinese
}

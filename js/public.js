let a = {
  getFDate:date=>{
    var d = eval('new ' + date.substr(1, date.length - 2));

    var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];

    for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
    return ar_date.join('-');
  },
  dFormat:i=> {
    return i < 10 ? "0" + i.toString() : i;
  },
  show:()=>{
    console.log(1);
  }
}

module.exports={
  fun:a
}
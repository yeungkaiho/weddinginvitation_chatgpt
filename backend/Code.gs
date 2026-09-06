// The spreadsheet ID is configured in doPost below.
// Deploy as the wedding account, accessible to Anyone. The Sheet stays private.
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return json_({ok:true,service:'Sophia & Kaiho RSVP'}); }
function text_(value,max,required) {
  if(typeof value !== 'string' || value.length>max || (required && !value.trim())) throw new Error('Invalid text');
  const text=value.trim(); return /^[=+@\-\t\r]/.test(text) ? "'"+text : text;
}
function integer_(value,max) { if(!Number.isInteger(value)||value<0||value>max) throw new Error('Invalid number');return value; }
function validate_(p) {
  if(!p || p.website || p.consent!==true || !/^[0-9a-f-]{36}$/i.test(p.id||'')) throw new Error('Invalid request');
  if(!['出席','未能出席'].includes(p.attend)) throw new Error('Invalid attendance');
  const attending=p.attend==='出席';
  if(attending && !['證婚及午宴','只出席證婚','只出席午宴'].includes(p.events)) throw new Error('Invalid event');
  if(attending && !['自行前往','希望乘坐接駁車','自行駕車','尚未決定'].includes(p.transport)) throw new Error('Invalid transport');
  const adults=attending?integer_(p.adults,30):0, children=attending?integer_(p.children,30):0, total=adults+children;
  if(attending && total<1) throw new Error('No guests');
  if(typeof p.phone!=='string' || !/^\+?[\d ()-]{8,24}$/.test(p.phone) || p.phone.replace(/\D/g,'').length<8) throw new Error('Invalid phone');
  return [p.id,new Date(),text_(p.name,80,true),text_(p.phone,24,true),p.attend,adults,children,attending&&p.events!=='只出席午宴'?total:0,attending&&p.events!=='只出席證婚'?total:0,attending?integer_(p.pets,10):0,attending?p.transport:'不適用',attending?text_(p.diet||'',1000,false):'',text_(p.note||'',1500,false),'已同意'];
}
function doPost(e) {
  let lock;
  try {
    if(!e || !e.postData || e.postData.contents.length>12000) throw new Error('Invalid request');
    const payload=JSON.parse(e.postData.contents), row=validate_(payload);
    lock=LockService.getScriptLock();lock.waitLock(15000);
    const id='1ptLmsqMoMv6F7AGF5jiqSGd8cDm5miuh-kS70eGa1nU';
    if(!id) throw new Error('Not configured');
    const sheet=SpreadsheetApp.openById(id).getSheetByName('親友回覆');
    if(!sheet || sheet.getRange('A1').getValue()!=='回覆編號') throw new Error('Invalid schema');
    const last=sheet.getLastRow();
    const found=last>1?sheet.getRange(2,1,last-1,1).createTextFinder(payload.id).matchEntireCell(true).findNext():null;
    const target=found?found.getRow():Math.max(2,last+1);
    if(target>10000) throw new Error('Response limit');
    if(target>sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(),100);
    sheet.getRange(target,1,1,14).setValues([row]);
    sheet.getRange(target,2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();
    return json_({ok:true,id:payload.id});
  } catch(error) { return json_({ok:false,error:'未能儲存回覆，請檢查資料或稍後重試。'}); }
  finally {if(lock&&lock.hasLock())lock.releaseLock();}
}

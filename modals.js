window.CopellaModals = (function(){
  function openStationModal(editIndex) {
    var isEditing = (editIndex !== undefined && editIndex !== null);
    var station = isEditing ? CopellaState.stations[editIndex] : {};
    var modalContent = '<div class="modal-content bg-panel-bg p-6 rounded-large w-full max-w-md transform scale-95 transition-transform duration-300">' +
      '<div class="flex justify-between items-center mb-6"><h2 class="text-xl font-bold">' + (isEditing ? 'Ð ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ' : 'ÐÐ¾Ð²Ð°Ñ ÑÑ‚Ð°Ð½Ñ†Ð¸Ñ') + '</h2><button class="close-btn text-2xl text-text-secondary">&times;</button></div>' +
      '<form id="stationForm" data-index="' + (isEditing ? editIndex : 'null') + '" class="flex flex-col gap-4">' +
      '<label for="stationIconFile" class="mx-auto"><div id="icon-upload-area" style="background-image: url(' + (station.icon || '') + ')" class="w-28 h-28 rounded-large border-2 border-dashed border-border-color flex flex-col justify-center items-center text-text-secondary cursor-pointer bg-cover bg-center transition-all">' + (!station.icon ? '<span>Ð˜ÐºÐ¾Ð½ÐºÐ°</span>' : '') + '</div></label>' +
      '<input type="file" id="stationIconFile" accept="image/*" class="hidden">' +
      '<input type="text" id="stationName" placeholder="ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ" value="' + (station.name || '') + '" required class="w-full p-3 border border-border-color rounded-small text-base bg-bg-color text-text-primary focus:ring-2 focus:ring-accent/50 outline-none">' +
      '<input type="url" id="stationUrl" placeholder="URL Ð¿Ð¾Ñ‚Ð¾ÐºÐ°" value="' + (station.url || '') + '" required class="w-full p-3 border border-border-color rounded-small text-base bg-bg-color text-text-primary focus:ring-2 focus:ring-accent/50 outline-none">' +
      '<button type="submit" class="w-full p-3 text-base font-bold rounded-small border-none bg-accent text-bg-color cursor-pointer mt-2">' + (isEditing ? 'Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ' : 'Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ') + '</button>' +
      '</form></div>';
    CopellaUI.openModal(CopellaDOM.stationModal, modalContent);
    CopellaDOM.stationModal.querySelector('.close-btn').onclick = function(){ CopellaUI.closeModal(CopellaDOM.stationModal); };
    CopellaDOM.stationModal.querySelector('#stationForm').onsubmit = handleFormSubmit;
    CopellaDOM.stationModal.querySelector('#stationIconFile').onchange = function(e){ var file = e.target.files[0], iconArea = CopellaDOM.stationModal.querySelector('#icon-upload-area'); if (file) { var reader = new FileReader(); reader.onload = function(ev){ iconArea.style.backgroundImage = 'url(' + ev.target.result + ')'; iconArea.innerHTML = ''; }; reader.readAsDataURL(file); } };
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var name = form.querySelector('#stationName').value.trim();
    var url = form.querySelector('#stationUrl').value.trim();
    var file = form.querySelector('#stationIconFile').files[0];
    var editIndex = form.dataset.index !== 'null' ? parseInt(form.dataset.index) : null;
    if (!name || !url) return;
    var processStation = function(iconData){
      var newData = { name: name, url: url, icon: iconData };
      if (editIndex !== null) {
        if (!iconData) newData.icon = CopellaState.stations[editIndex].icon;
        CopellaState.stations[editIndex] = newData;
        if (CopellaState.currentStationIndex === editIndex) { CopellaPlayer.renderPlayer(newData); }
      } else { CopellaState.stations.push({ name: name, url: url, icon: iconData || '' }); }
      CopellaStorage.saveStations();
      CopellaStations.renderList(CopellaDOM.stationSearchInput.value);
      CopellaUI.closeModal(CopellaDOM.stationModal);
      CopellaUI.showToast(editIndex !== null ? 'Ð¡Ñ‚Ð°Ð½Ñ†Ð¸Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð°' : 'Ð¡Ñ‚Ð°Ð½Ñ†Ð¸Ñ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð°', 'success');
    };
    if (file) { var reader = new FileReader(); reader.onload = function(ev){ processStation(ev.target.result); }; reader.readAsDataURL(file); }
    else { processStation(editIndex !== null ? (CopellaState.stations[editIndex] ? CopellaState.stations[editIndex].icon : null) : null); }
  }
  function openWelcomeModal() {
    var content = '<div class="modal-content bg-panel-bg p-6 rounded-large w-full max-w-md transform scale-95 transition-transform duration-300">' +
      '<div class="text-center mb-4"><h2 class="text-xl font-bold">NCWebRecorder</h2></div>' +
      '<div class="text-text-secondary space-y-4 text-center">' +
        '<p class="font-semibold text-accent-green">Proudly fixed & cracked by Kektris (again): kektris.github.io</p>' +
        '<div class="space-y-3 text-left">' +
          '<div class="flex items-start gap-2"><span class="text-accent-green font-bold">â€¢</span><span><strong>ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ð»ÐµÐ¹Ð»Ð¸ÑÑ‚Ñ‹</strong> Ð¸Ð· Ð·Ð°Ð¿Ð¸ÑÐµÐ¹</span></div>' +
          '<div class="flex items-start gap-2"><span class="text-accent-green font-bold">â€¢</span><span><strong>Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð° Ñ‚ÐµÐ³Ð¾Ð²</strong> Ð´Ð»Ñ Ð·Ð°Ð¿Ð¸ÑÐµÐ¹</span></div>' +
          '<div class="flex items-start gap-2"><span class="text-accent-green font-bold">â€¢</span><span><strong>ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð·Ð°Ð¿Ð¸ÑÑÐ¼</strong> Ð¸ ÑƒÐ¼Ð½Ð¾Ðµ Ð¿ÐµÑ€ÐµÐ¸Ð¼ÐµÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ</span></div>' +
          '<div class="flex items-start gap-2"><span class="text-accent-green font-bold">â€¢</span><span><strong>Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² JSON/CSV/TXT</strong> Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð°Ñ…</span></div>' +
          '<div class="flex items-start gap-2"><span class="text-accent-green font-bold">â€¢</span><span><strong>ÐœÐ¾Ð±Ð¸Ð»ÑŒÐ½Ð°Ñ Ð°Ð´Ð°Ð¿Ñ‚Ð°Ñ†Ð¸Ñ</strong> Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°</span></div>' +
        '</div>' +
        '<p class="text-sm mt-4">Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¾ <strong>6 Ð½Ð¾Ð²Ñ‹Ñ… Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¹</strong> Ð´Ð»Ñ ÑƒÐ´Ð¾Ð±Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ñ Ð·Ð°Ð¿Ð¸ÑÑÐ¼Ð¸!</p>' +
      '</div>' +
      '<button id="closeWelcomeBtn" class="w-full p-3 text-base font-bold rounded-small border-none bg-accent text-bg-color cursor-pointer mt-6">ÐÐ°Ñ‡Ð°Ñ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ</button></div>';
    CopellaUI.openModal(CopellaDOM.welcomeModal, content);
    CopellaDOM.welcomeModal.querySelector('#closeWelcomeBtn').onclick = function(){ CopellaUI.closeModal(CopellaDOM.welcomeModal); localStorage.setItem(CopellaConfig.STORAGE_KEYS.welcomeSeen, 'true'); };
  }
  function openSettingsModal() {
    var currentFormat = CopellaStorage.getRecordingFormat();
    var content = '<div class="modal-content bg-panel-bg p-4 rounded-large w-full max-w-sm transform scale-95 transition-transform duration-300 flex flex-col">' +
      '<div class="flex justify-between items-center mb-3 flex-shrink-0"><h2 class="text-lg font-bold">ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸</h2><button class="close-btn text-xl text-text-secondary">&times;</button></div>' +
      '<div class="flex border-b border-border-color mb-3">' +
      '<button class="tab-btn px-3 py-2 text-sm font-bold border-b-2 border-accent text-accent" data-tab="recording">Ð—Ð°Ð¿Ð¸ÑÑŒ</button>' +
      '<button class="tab-btn px-3 py-2 text-sm font-bold border-b-2 border-transparent text-text-secondary" data-tab="data">Ð”Ð°Ð½Ð½Ñ‹Ðµ</button>' +
      '</div>' +
      '<div id="tab-content" class="flex-grow">' +
      '<div id="recording-tab" class="tab-panel">' +
      '<div class="space-y-3">' +
      '<div><h3 class="font-bold text-text-primary mb-2 text-sm">Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð·Ð°Ð¿Ð¸ÑÐ¸</h3><div class="flex flex-col gap-1" id="formatChooser">' +
      '<div class="flex items-center gap-2 p-2 bg-zinc-800 rounded-small cursor-pointer text-sm" data-format="mp3"><div class="custom-radio w-4 h-4 rounded-full border-2 border-border-color flex items-center justify-center ' + (currentFormat === 'mp3' ? 'border-accent' : '') + '"><div class="w-2 h-2 rounded-full bg-accent ' + (currentFormat === 'mp3' ? '' : 'hidden') + '"></div></div><span>MP3 (ÑƒÐ½Ð¸Ð²ÐµÑ€ÑÐ°Ð»ÑŒÐ½Ñ‹Ð¹)</span></div>' +
      '<div class="flex items-center gap-2 p-2 bg-zinc-800 rounded-small cursor-pointer text-sm" data-format="webm"><div class="custom-radio w-4 h-4 rounded-full border-2 border-border-color flex items-center justify-center ' + (currentFormat === 'webm' ? 'border-accent' : '') + '"><div class="w-2 h-2 rounded-full bg-accent ' + (currentFormat === 'webm' ? '' : 'hidden') + '"></div></div><span>WebM (Ð±Ñ‹ÑÑ‚Ñ€Ð¾)</span></div>' +
      '</div></div>' +
      '</div></div>' +
      '<div id="data-tab" class="tab-panel hidden">' +
      '<div class="space-y-3">' +
      '<div><h3 class="font-bold text-text-primary mb-2 text-sm">Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸</h3><div class="flex gap-2">' +
      '<button id="exportBtn" class="flex-1 p-2 text-sm font-bold rounded-small border border-border-color bg-zinc-800 text-text-primary cursor-pointer">Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚</button>' +
      '<label class="flex-1 p-2 text-sm font-bold rounded-small border border-border-color bg-zinc-800 text-text-primary cursor-pointer text-center">Ð˜Ð¼Ð¿Ð¾Ñ€Ñ‚ <input type="file" id="importFile" accept=".json" class="hidden"></label>' +
      '</div></div>' +
      '</div></div>' +
      '</div>' +
      '<div class="text-center text-xs text-text-secondary pt-2 mt-3"><strong>NCWebRecorder 1.1</strong><br>Наш сайт: <a href="https://kektris.github.io/ncwr">kektris.github.io/ncwr</a></div>' +
      '</div>';
    CopellaUI.openModal(CopellaDOM.settingsModal, content);
    CopellaDOM.settingsModal.querySelector('.close-btn').onclick = function(){ CopellaUI.closeModal(CopellaDOM.settingsModal); };
    CopellaDOM.settingsModal.querySelector('#exportBtn').onclick = exportStations;
    CopellaDOM.settingsModal.querySelector('#importFile').onchange = importStations;
    
    // ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¸ Ð´Ð»Ñ Ð²ÐºÐ»Ð°Ð´Ð¾Ðº
    Array.prototype.forEach.call(CopellaDOM.settingsModal.querySelectorAll('.tab-btn'), function(btn){
      btn.onclick = function(){
        var tabName = this.dataset.tab;
        // ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ð°ÐºÑ‚Ð¸Ð²Ð½ÑƒÑŽ Ð²ÐºÐ»Ð°Ð´ÐºÑƒ
        Array.prototype.forEach.call(CopellaDOM.settingsModal.querySelectorAll('.tab-btn'), function(otherBtn){
          otherBtn.classList.remove('border-accent', 'text-accent');
          otherBtn.classList.add('border-transparent', 'text-text-secondary');
        });
        this.classList.remove('border-transparent', 'text-text-secondary');
        this.classList.add('border-accent', 'text-accent');
        // ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚
        Array.prototype.forEach.call(CopellaDOM.settingsModal.querySelectorAll('.tab-panel'), function(panel){
          panel.classList.add('hidden');
        });
        document.getElementById(tabName + '-tab').classList.remove('hidden');
      };
    });
    
    // ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¸ Ð´Ð»Ñ ÐºÐ°ÑÑ‚Ð¾Ð¼Ð½Ñ‹Ñ… Ñ€Ð°Ð´Ð¸Ð¾-ÐºÐ½Ð¾Ð¿Ð¾Ðº
    Array.prototype.forEach.call(CopellaDOM.settingsModal.querySelectorAll('[data-format]'), function(item){
      item.onclick = function(){
        var format = this.dataset.format;
        // ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ð²Ð¸Ð·ÑƒÐ°Ð»ÑŒÐ½Ð¾Ðµ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ
        Array.prototype.forEach.call(CopellaDOM.settingsModal.querySelectorAll('[data-format]'), function(otherItem){
          var radio = otherItem.querySelector('.custom-radio');
          var dot = radio.querySelector('div');
          radio.classList.remove('border-accent');
          dot.classList.add('hidden');
        });
        var radio = this.querySelector('.custom-radio');
        var dot = radio.querySelector('div');
        radio.classList.add('border-accent');
        dot.classList.remove('hidden');
        // Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÑÐµÐ¼ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÑƒ
        CopellaStorage.saveRecordingFormat(format);
        CopellaUI.showToast('Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð·Ð°Ð¿Ð¸ÑÐ¸ ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½!', 'success');
      };
    });
  }
  function exportStations() {
    if (CopellaState.stations.length === 0) { CopellaUI.showToast('Ð¡Ð¿Ð¸ÑÐ¾Ðº ÑÑ‚Ð°Ð½Ñ†Ð¸Ð¹ Ð¿ÑƒÑÑ‚.', 'warning'); return; }
    var dataStr = JSON.stringify(CopellaState.stations, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'copella-stations-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    CopellaUI.showToast('Ð¤Ð°Ð¹Ð» ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð° Ð³Ð¾Ñ‚Ð¾Ð²!', 'success');
  }
  function importStations(event) {
    var file = event.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
      try { var imported = JSON.parse(e.target.result); if (!Array.isArray(imported) || !imported.every(function(s){ return s.name && s.url; })) throw new Error('Invalid file format.'); CopellaState.stations = imported; CopellaStorage.saveStations(); CopellaStations.renderList(); CopellaUI.closeModal(CopellaDOM.settingsModal); CopellaUI.showToast('Ð¡Ñ‚Ð°Ð½Ñ†Ð¸Ð¸ ÑƒÑÐ¿ÐµÑˆÐ½Ð¾ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ñ‹!', 'success'); }
      catch(err){ CopellaUI.showToast('ÐžÑˆÐ¸Ð±ÐºÐ° Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð°. ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚ Ñ„Ð°Ð¹Ð»Ð°.', 'error'); }
    };
    reader.readAsText(file);
  }
  function closeModal(modalRef) {
    var modal = (typeof modalRef === 'string') ? document.getElementById(modalRef) : modalRef;
    CopellaUI.closeModal(modal);
  }
  return { openStationModal: openStationModal, openWelcomeModal: openWelcomeModal, openSettingsModal: openSettingsModal, closeModal: closeModal };
})();

(function () {
  "use strict";

  var DATA_URL = "materials.json";
  var player = null;
  var activeBtn = null;

  function qs(sel) {
    return document.querySelector(sel);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setBtnIcon(btn, playing) {
    if (!btn) return;
    btn.dataset.playing = playing ? "1" : "0";
    var icon = btn.querySelector(".icon");
    if (icon) icon.textContent = playing ? "❚❚" : "▶";
  }

  function stopAll() {
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    if (activeBtn) setBtnIcon(activeBtn, false);
    activeBtn = null;
  }

  function playSrc(src, btn) {
    if (!src) return;
    if (player && !player.paused && activeBtn === btn) {
      stopAll();
      return;
    }
    stopAll();
    if (!player) player = new Audio();
    player.src = src;
    player.play().catch(function () {
      setBtnIcon(btn, false);
    });
    activeBtn = btn;
    setBtnIcon(btn, true);
    player.onended = function () {
      if (activeBtn) setBtnIcon(activeBtn, false);
      activeBtn = null;
    };
  }

  function chip(text) {
    var s = document.createElement("span");
    s.className = "chip";
    s.textContent = text;
    return s;
  }

  async function loadMaterials() {
    var res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("数据加载失败：" + res.status);
    return res.json();
  }

  function renderList(app, materials) {
    if (!materials.length) {
      app.innerHTML = '<div class="empty-tip">还没有材料，等第一篇发布吧。</div>';
      return;
    }
    materials.forEach(function (m) {
      var card = document.createElement("article");
      card.className = "card material-card";

      var top = document.createElement("div");
      top.className = "card-top";
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "影子跟读 " + m.num;
      var date = document.createElement("span");
      date.className = "date";
      date.textContent = m.date;
      top.appendChild(tag);
      top.appendChild(date);

      var title = document.createElement("h2");
      var link = document.createElement("a");
      link.href = "read.html?id=" + encodeURIComponent(m.id);
      link.textContent = m.titleEn;
      title.appendChild(link);

      var cn = document.createElement("p");
      cn.className = "title-cn";
      cn.textContent = m.titleCn;

      var chips = document.createElement("div");
      chips.className = "chips";
      chips.appendChild(chip("全文 " + m.wordCountLabel));
      chips.appendChild(chip("音频 " + m.durationLabel));
      chips.appendChild(chip("难度 " + m.difficulty));
      chips.appendChild(chip("生词 " + m.vocabCount + " 个"));

      var actions = document.createElement("div");
      actions.className = "actions";
      var go = document.createElement("a");
      go.className = "btn btn-primary";
      go.href = link.href;
      go.textContent = "进入阅读";
      var play = document.createElement("button");
      play.className = "btn btn-ghost";
      play.dataset.src = m.audioFull;
      play.dataset.label = "整篇音频";
      play.innerHTML = '<span class="icon">▶</span>播放全文';
      if (!m.audioFull) play.disabled = true;
      actions.appendChild(go);
      actions.appendChild(play);

      card.appendChild(top);
      card.appendChild(title);
      card.appendChild(cn);
      card.appendChild(chips);
      card.appendChild(actions);
      app.appendChild(card);
    });
  }

  function renderRead(reader, m) {
    document.title = "影子跟读 " + m.num + "｜" + m.titleEn;

    var head = document.createElement("section");
    head.className = "article-head";
    var h1 = document.createElement("h1");
    h1.textContent = "影子跟读 " + m.num;
    var h2 = document.createElement("h2");
    h2.textContent = m.titleEn;
    var cn = document.createElement("p");
    cn.className = "title-cn";
    cn.textContent = m.titleCn;
    head.appendChild(h1);
    head.appendChild(h2);
    head.appendChild(cn);

    var chips = document.createElement("div");
    chips.className = "chips";
    chips.appendChild(chip("全文 " + m.wordCountLabel));
    chips.appendChild(chip("音频 " + m.durationLabel));
    chips.appendChild(chip("难度 " + m.difficulty));
    chips.appendChild(chip("生词 " + m.vocabCount + " 个"));
    head.appendChild(chips);

    var fullBox = document.createElement("div");
    fullBox.className = "actions";
    var fullBtn = document.createElement("button");
    fullBtn.className = "btn btn-primary";
    fullBtn.dataset.src = m.audioFull;
    fullBtn.dataset.label = "整篇音频";
    fullBtn.innerHTML = '<span class="icon">▶</span>播放全文';
    if (!m.audioFull) fullBtn.disabled = true;
    fullBox.appendChild(fullBtn);
    head.appendChild(fullBox);
    reader.appendChild(head);

    var bodyCard = document.createElement("section");
    bodyCard.className = "card";
    var bodyTitle = document.createElement("h2");
    bodyTitle.className = "section-title";
    bodyTitle.textContent = "英文正文";
    bodyCard.appendChild(bodyTitle);

    m.segments.forEach(function (seg, idx) {
      var div = document.createElement("div");
      div.className = "para";
      var phead = document.createElement("div");
      phead.className = "para-head";
      var pbtn = document.createElement("button");
      pbtn.className = "btn-para";
      pbtn.dataset.label = "第 " + (idx + 1) + " 段";
      pbtn.innerHTML = '<span class="icon">▶</span><span>第 ' + (idx + 1) + " 段</span>";
      if (seg.audio) {
        pbtn.dataset.src = seg.audio;
      } else {
        pbtn.disabled = true;
        pbtn.title = "该段音频暂不可用";
      }
      phead.appendChild(pbtn);
      div.appendChild(phead);
      var p = document.createElement("p");
      p.className = "en-text";
      p.innerHTML = m.paragraphs[idx];
      div.appendChild(p);
      bodyCard.appendChild(div);
    });
    reader.appendChild(bodyCard);

    var vocabCard = document.createElement("section");
    vocabCard.className = "card";
    var vocabTitle = document.createElement("h2");
    vocabTitle.className = "section-title";
    vocabTitle.textContent = "生词自查表";
    vocabCard.appendChild(vocabTitle);
    if (m.vocabNote) {
      var note = document.createElement("p");
      note.className = "note";
      note.textContent = m.vocabNote;
      vocabCard.appendChild(note);
    }
    var wrap1 = document.createElement("div");
    wrap1.className = "table-wrap";
    var table1 = document.createElement("table");
    var thead1 = document.createElement("thead");
    var tr1 = document.createElement("tr");
    ["单词", "词性", "中文"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr1.appendChild(th);
    });
    thead1.appendChild(tr1);
    var tb1 = document.createElement("tbody");
    m.vocabRows.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell, i) {
        var td = document.createElement("td");
        td.textContent = cell;
        if (i === 0) td.className = "w-en";
        tr.appendChild(td);
      });
      tb1.appendChild(tr);
    });
    table1.appendChild(thead1);
    table1.appendChild(tb1);
    wrap1.appendChild(table1);
    vocabCard.appendChild(wrap1);
    reader.appendChild(vocabCard);

    var phraseCard = document.createElement("section");
    phraseCard.className = "card";
    var phraseTitle = document.createElement("h2");
    phraseTitle.className = "section-title";
    phraseTitle.textContent = "好词好句·短语积累";
    phraseCard.appendChild(phraseTitle);
    var wrap2 = document.createElement("div");
    wrap2.className = "table-wrap";
    var table2 = document.createElement("table");
    var thead2 = document.createElement("thead");
    var tr2 = document.createElement("tr");
    ["表达", "意思", "文中出处"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr2.appendChild(th);
    });
    thead2.appendChild(tr2);
    var tb2 = document.createElement("tbody");
    m.phraseRows.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell, i) {
        var td = document.createElement("td");
        td.textContent = cell;
        if (i === 0) td.className = "w-en";
        tr.appendChild(td);
      });
      tb2.appendChild(tr);
    });
    table2.appendChild(thead2);
    table2.appendChild(tb2);
    wrap2.appendChild(table2);
    phraseCard.appendChild(wrap2);
    reader.appendChild(phraseCard);

    var transCard = document.createElement("section");
    transCard.className = "card";
    var transTitle = document.createElement("h2");
    transTitle.className = "section-title";
    transTitle.textContent = "全文中文翻译";
    transCard.appendChild(transTitle);
    var toggle = document.createElement("button");
    toggle.className = "btn trans-toggle";
    toggle.textContent = "展开中文翻译（建议先跟读再看）";
    var box = document.createElement("div");
    box.className = "trans-box";
    box.hidden = true;
    m.translation.forEach(function (paraText) {
      var p = document.createElement("p");
      p.textContent = paraText;
      box.appendChild(p);
    });
    toggle.addEventListener("click", function () {
      var showing = !box.hidden;
      box.hidden = showing;
      toggle.textContent = showing ? "展开中文翻译（建议先跟读再看）" : "收起中文翻译";
    });
    transCard.appendChild(toggle);
    transCard.appendChild(box);
    reader.appendChild(transCard);
  }

  function onDataClick(e) {
    var btn = e.target.closest("[data-src]");
    if (!btn) return;
    playSrc(btn.dataset.src, btn);
  }

  async function boot() {
    try {
      var data = await loadMaterials();
      var materials = Array.isArray(data) ? data : data.materials;
      var app = qs("#app");
      if (app) {
        renderList(app, materials);
        app.addEventListener("click", onDataClick);
        return;
      }
      var reader = qs("#reader");
      if (reader) {
        var id = new URLSearchParams(location.search).get("id");
        var m = materials.find(function (x) { return x.id === id; });
        if (!m) {
          reader.innerHTML = '<div class="empty-tip">没有找到这篇材料，<a href="index.html">回到列表</a>。</div>';
          return;
        }
        renderRead(reader, m);
        reader.addEventListener("click", onDataClick);
      }
    } catch (err) {
      var target = qs("#app") || qs("#reader");
      if (target) target.innerHTML = '<div class="empty-tip">页面加载失败：' + escapeHtml(err.message) + "</div>";
    }
  }

  boot();
})();

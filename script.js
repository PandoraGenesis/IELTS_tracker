const SKILLS = [
  { key: 'listening', label: 'Listening', baseline: 6.5, target: 8.5, color: '#0E9488' },
  { key: 'reading', label: 'Reading', baseline: 5.5, target: 8.5, color: '#C08A12' },
  { key: 'writing', label: 'Writing', baseline: 5.5, target: 7.5, color: '#C13F68' },
  { key: 'speaking', label: 'Speaking', baseline: 6.0, target: 7.0, color: '#6B54CC' },
];

const OVERALL_TARGET = Math.round((SKILLS.reduce((a, s) => a + s.target, 0) / SKILLS.length) * 2) / 2;
const OVERALL_BASELINE = Math.round((SKILLS.reduce((a, s) => a + s.baseline, 0) / SKILLS.length) * 2) / 2;

const RAW_SCORE_SKILLS = ['listening', 'reading'];

const SUB_CRITERIA = {
  writing: ['TA', 'CC', 'LR', 'GR'],
  speaking: ['FC', 'LR', 'PR', 'GR'],
};

function computeSubBand(record, field) {
  const crits = SUB_CRITERIA[field];
  if (!crits || !record) return null;
  const vals = crits
    .map((c) => record[field + c])
    .filter((v) => v !== undefined && v !== null && v !== '')
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v));
  if (vals.length === 0) return null;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(mean * 2) / 2;
}

const LISTENING_TABLE = [
  [39, 9.0], [37, 8.5], [35, 8.0], [32, 7.5], [30, 7.0], [26, 6.5], [23, 6.0], [18, 5.5],
  [16, 5.0], [13, 4.5], [11, 4.0], [8, 3.5], [6, 3.0], [4, 2.5], [3, 2.0], [2, 1.5], [1, 1.0], [0, 1.0],
];
const READING_TABLE = [
  [39, 9.0], [37, 8.5], [35, 8.0], [33, 7.5], [30, 7.0], [27, 6.5], [23, 6.0], [19, 5.5],
  [15, 5.0], [13, 4.5], [10, 4.0], [8, 3.5], [6, 3.0], [4, 2.5], [3, 2.0], [2, 1.5], [1, 1.0], [0, 1.0],
];

function rawToBand(skillKey, raw) {
  if (raw === '' || raw === null || raw === undefined) return null;
  const n = parseInt(raw, 10);
  if (isNaN(n)) return null;
  const clamped = Math.max(0, Math.min(40, n));
  const table = skillKey === 'listening' ? LISTENING_TABLE : READING_TABLE;
  for (let i = 0; i < table.length; i++) {
    if (clamped >= table[i][0]) return table[i][1];
  }
  return 0;
}

function bandFieldHtml(s, record, extraAttrs, kindPrefix) {
  if (RAW_SCORE_SKILLS.indexOf(s.key) !== -1) {
    const rawVal = record[s.key + 'Raw'];
    const bandVal = record[s.key];
    const bandNum = (bandVal !== undefined && bandVal !== null && bandVal !== '') ? parseFloat(bandVal) : null;
    return '<div class="band-field">'
      + '<label style="color:' + s.color + '">' + s.label + '</label>'
      + '<div class="raw-score-row">'
      + '<span class="raw-suffix" style="color:' + s.color + '">(Đúng/40)</span>'
      + '<input type="number" min="0" max="40" step="1" placeholder="—" value="' + (rawVal !== undefined && rawVal !== null ? rawVal : '') + '" data-kind="' + kindPrefix + 'raw" data-field="' + s.key + '" ' + extraAttrs + ' />'
      + '</div>'
      + '<div class="raw-band-out" style="background:' + s.color + '1F; color:' + s.color + '; border:1px solid ' + s.color + '55;">Band: ' + (bandNum !== null ? bandNum.toFixed(1) : '—') + '</div>'
      + '</div>';
  }
  const crits = SUB_CRITERIA[s.key];
  if (crits) {
    const bandNum = computeSubBand(record, s.key);
    const subInputs = crits.map((c) => {
      const v = record[s.key + c];
      return '<div class="sub-score-item"><span class="sub-score-label" style="color:' + s.color + '">' + c + '</span>'
        + '<input type="number" step="0.5" min="0" max="9" placeholder="—" value="' + (v !== undefined && v !== null ? v : '') + '" data-kind="' + kindPrefix + 'sub" data-field="' + s.key + '" data-sub="' + c + '" ' + extraAttrs + ' /></div>';
    }).join('');
    return '<div class="band-field span4">'
      + '<label style="color:' + s.color + '">' + s.label + '</label>'
      + '<div class="sub-score-grid">' + subInputs + '</div>'
      + '<div class="raw-band-out" style="background:' + s.color + '1F; color:' + s.color + '; border:1px solid ' + s.color + '55;">Band: ' + (bandNum !== null ? bandNum.toFixed(1) : '—') + '</div>'
      + '</div>';
  }
  const bandVal = record[s.key];
  return '<div class="band-field">'
    + '<label style="color:' + s.color + '">' + s.label + '</label>'
    + '<input type="number" step="0.5" min="0" max="9" placeholder="—" value="' + (bandVal !== undefined && bandVal !== null ? bandVal : '') + '" data-kind="' + kindPrefix + 'band" data-field="' + s.key + '" ' + extraAttrs + ' /></div>';
}

function noteFieldHtml(value, kindName, extraAttrs, placeholderText) {
  return '<div class="note-field">'
    + '<label>Ghi chú</label>'
    + '<div class="note-editable" contenteditable="true" data-placeholder="' + placeholderText + '" data-kind="' + kindName + '" ' + extraAttrs + '>' + (value || '') + '</div>'
    + '</div>';
}

function dateFieldHtml(value, kindPrefix, extraAttrs) {
  return '<span class="date-wrap">'
    + '<input type="text" class="date-input" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" value="' + escapeHtml(value || '') + '" data-kind="' + kindPrefix + 'date-text" ' + extraAttrs + ' />'
    + '<button type="button" class="date-icon-btn" data-action="open-date-picker" aria-label="Chọn ngày từ lịch">'
    + '<svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
    + '</button>'
    + '<input type="date" lang="vi" class="date-native" value="' + ddmmyyyyToIso(value) + '" data-kind="' + kindPrefix + 'date" ' + extraAttrs + ' />'
    + '</span>';
}

function countFilledSkills(test) {
  let count = 0;
  SKILLS.forEach((s) => {
    const v = test[s.key];
    if (v !== undefined && v !== null && v !== '') count++;
  });
  return count;
}

function unitHasData(unit) {
  return !!unit && unit.tests.some((test) => countFilledSkills(test) > 0);
}

function completionLegendHtml() {
  return '<div style="display:flex; gap:14px; flex-wrap:wrap; margin-top:10px; font-size:11px; color:var(--ink-muted);">'
    + '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--inset);border:1px solid var(--border);margin-right:4px;"></span>Chưa có điểm</span>'
    + '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--pending);margin-right:4px;"></span>Đã có điểm</span>'
    + '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--success);margin-right:4px;"></span>Hoàn thành</span>'
    + '</div>';
}

function testStatusStyle(count) {
  if (count >= 4) return { bg: 'var(--success)', border: 'var(--success)', color: '#FFFFFF' };
  if (count === 3) return { bg: 'var(--warning)', border: 'var(--warning)', color: '#FFFFFF' };
  if (count === 2) return { bg: 'var(--danger)', border: 'var(--danger)', color: '#FFFFFF' };
  return { bg: 'var(--inset)', border: 'var(--border)', color: 'var(--ink-muted)' };
}

function testSummaryHtml(tests, idPrefix) {
  const cells = tests.map((test, idx) => {
    const style = testStatusStyle(countFilledSkills(test));
    return '<div class="summary-cell">'
      + '<div class="summary-badge" data-action="scroll-to-test" data-target="' + idPrefix + idx + '" style="cursor:pointer; background:' + style.bg + '; border-color:' + style.border + '; color:' + style.color + ';">'
      + (idx + 1) + '</div></div>';
  }).join('');
  return '<div class="week-summary-head"><span style="color:var(--ink-muted)">Test</span></div>'
    + '<div class="circle-wrap-grid" style="grid-template-columns:repeat(' + Math.max(tests.length, 1) + ',minmax(0,1fr));">' + cells + '</div>'
    + '<div style="display:flex; gap:14px; flex-wrap:wrap; margin-top:10px; font-size:11px; color:var(--ink-muted);">'
    + '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);margin-right:4px;"></span>2 kỹ năng</span>'
    + '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warning);margin-right:4px;"></span>3 kỹ năng</span>'
    + '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--success);margin-right:4px;"></span>Đủ 4 kỹ năng</span>'
    + '</div>';
}

const WEEK_LABELS = {
  1: 'Xác lập baseline & xây kỹ thuật nền tảng',
  2: 'Nâng chất ngôn ngữ, xử lý dạng khó',
  3: 'Mock test cường độ cao, khóa lỗi trọng điểm',
  4: 'Dồn lực tối đa, mô phỏng áp lực thi thật',
};

const PLAN = [
  { week: 1, day: 1, isTest: true, title: 'Full mock test — Xác lập baseline',
    desc: 'Làm 1 đề đầy đủ 4 kỹ năng trong điều kiện bấm giờ như thi thật. Chấm ngay và ghi lại band ước tính cho từng kỹ năng để làm mốc so sánh cho cả tháng.' },
  { week: 1, day: 2, isTest: false, title: 'Phân tích lỗi & học lại cấu trúc chuẩn',
    desc: 'Phân tích chi tiết từng câu sai trong bài test hôm qua.<br>- <b>Reading:</b> Học kỹ thuật skimming.<br>- <b>Writing:</b> Học lại cấu trúc chuẩn Task 1 & Task 2.<br>- <b>Speaking:</b> Quay video Part 1-2-3, nghe lại liệt kê lỗi.' },
  { week: 1, day: 3, isTest: false, title: 'Kỹ thuật đọc nhanh & phản xạ nói',
    desc: '- <b>Listening:</b> Dictation 20 phút.<br>- <b>Reading:</b> Luyện scanning trên đoạn văn ngắn.<br>- <b>Writing:</b> Viết 1 bài Task 1 (line graph).<br>- <b>Speaking:</b> Luyện Part 2 chủ đề quen thuộc, ghi âm so với bản mẫu band 7-8.' },
  { week: 1, day: 4, isTest: false, title: 'True/False/Not Given & phản xạ ngữ pháp',
    desc: '- <b>Listening:</b> Luyện dạng note completion.<br>- <b>Reading:</b> Luyện riêng True/False/Not Given, 15-20 câu.<br>- <b>Writing:</b> Viết 1 bài Task 2 opinion essay.<br>- <b>Speaking:</b> Luyện Part 1, tăng tốc độ phản xạ.' },
  { week: 1, day: 5, isTest: false, title: 'Matching Headings & tự sửa bài viết',
    desc: '- <b>Listening:</b> Map/plan labelling.<br>- <b>Reading:</b> Luyện riêng Matching Headings.<br>- <b>Writing:</b> Tự sửa 2 bài đã viết theo band descriptor.<br>- <b>Speaking:</b> Luyện lại Part 2 chủ đề mới, giảm "uh"/ngập ngừng.' },
  { week: 1, day: 6, isTest: true, title: 'Full test có giờ & so sánh tiến bộ',
    desc: '- <b>Listening:</b> Full test 4 Part bấm giờ.<br>- <b>Reading:</b> Full test 60 phút/3 passage.<br>- <b>Writing:</b> Viết Task 1 và Task 2 (random đề).<br>- <b>Speaking:</b> Quay lại full Part 1-2-3, so với ngày 2.' },
  { week: 1, day: 7, isTest: false, title: 'Nghỉ hoàn toàn',
    desc: 'Không luyện đề, không học kiến thức mới. Có thể đọc nhẹ 1 bài báo hoặc nghe podcast tiếng Anh nếu muốn, không bắt buộc.' },

  { week: 2, day: 8, isTest: false, title: 'Timed reading & paraphrase',
    desc: '- <b>Listening:</b> Đa accent (Anh-Úc, Anh-Mỹ).<br>- <b>Reading:</b> Timed test, rút dần thời gian còn 55-60 phút/3 passage.<br>- <b>Writing:</b> Học paraphrase câu hỏi cho introduction.<br>- <b>Speaking:</b> Luyện Part 3 discussion.' },
  { week: 2, day: 9, isTest: false, title: 'Từ vựng học thuật & shadowing',
    desc: '- <b>Listening:</b> Luyện dạng matching.<br>- <b>Reading:</b> Học 15 collocation học thuật (AWL), áp dụng ngay.<br>- <b>Writing:</b> Viết 1 bài Task 1 áp dụng paraphrase.<br>- <b>Speaking:</b> Shadowing 15 phút theo TED Talk.' },
  { week: 2, day: 10, isTest: true, title: 'Full test đa accent & linking devices',
    desc: '- <b>Listening:</b> Full test đa accent.<br>- <b>Reading:</b> Full test timed nghiêm ngặt.<br>- <b>Writing:</b> Viết bài Task 2, dùng linking words/referencing.<br>- <b>Speaking:</b> Luyện Part 2 chủ đề trừu tượng hơn.' },
  { week: 2, day: 11, isTest: false, title: 'Đào sâu Matching Headings & lập luận 2 chiều',
    desc: '- <b>Listening:</b> Luyện lại đúng câu đã sai tuần trước.<br>- <b>Reading:</b> 20 bài Matching Headings.<br>- <b>Writing:</b> Tự sửa bài, chú trọng Coherence and Cohesion.<br>- <b>Speaking:</b> Part 3 lập luận 2 chiều.' },
  { week: 2, day: 12, isTest: false, title: 'Đào sâu T/F/NG & dictation nâng cao',
    desc: '- <b>Listening:</b> Dictation nâng cao, câu dài tốc độ nhanh.<br>- <b>Reading:</b> 20 bài True/False/Not Given.<br>- <b>Writing:</b> Viết bài Task 1 thứ hai trong tuần.<br>- <b>Speaking:</b> Shadowing + ghi âm so phát âm.' },
  { week: 2, day: 13, isTest: true, title: 'Full mock 4 kỹ năng',
    desc: 'Làm 1 đề đầy đủ 4 kỹ năng trong điều kiện thi thật.<br>- <b>Writing:</b> Bài Task 2 thứ hai trong tuần.<br>- <b>Speaking:</b> Tự chấm theo 4 tiêu chí band descriptor sau khi ghi âm.' },
  { week: 2, day: 14, isTest: false, title: 'Nghỉ hoàn toàn',
    desc: 'Không luyện đề nặng. Có thể review nhẹ vocabulary bank đã học trong tuần bằng flashcard nếu muốn.' },

  { week: 3, day: 15, isTest: true, title: 'Full mock test lần 1',
    desc: 'Làm đề đầy đủ 4 kỹ năng liên tục theo đúng lịch thi thật (L-R-W buổi sáng, Speaking buổi chiều). Chấm nghiêm khắc theo band descriptor ngay trong ngày.' },
  { week: 3, day: 16, isTest: false, title: 'Phân tích lỗi & dồn lực kỹ năng yếu nhất',
    desc: 'Phân tích lỗi từ mock hôm qua, so với checkpoint tuần 3. Dồn thời gian cho kỹ năng thấp nhất (thường là Reading).<br>- <b>Writing:</b> Bài Task 2 dạng advantages/disadvantages.' },
  { week: 3, day: 17, isTest: false, title: 'Luyện tập trung & mock interview',
    desc: '- <b>Listening & Reading:</b> Luyện theo đúng dạng lỗi vừa phát hiện.<br>- <b>Writing:</b> Viết 1 bài Task 1.<br>- <b>Speaking:</b> Tìm 1 buổi mock interview thật với giáo viên/bạn học, ghi âm toàn bộ.' },
  { week: 3, day: 18, isTest: true, title: 'Full mock test lần 2',
    desc: 'Làm đề đầy đủ 4 kỹ năng lần 2 trong tuần. So sánh trực tiếp với lần 1 (ngày 15) để xem kỹ năng nào đang tiến bộ.' },
  { week: 3, day: 19, isTest: false, title: 'Xử lý kỹ năng yếu còn lại',
    desc: 'Dồn thời gian cho kỹ năng yếu thứ hai theo checkpoint (thường là Writing).<br>- <b>Listening & Reading:</b> Nghe/đọc lại các đoạn hay sai để khắc sâu.<br>- <b>Writing:</b> Viết bài Task 2 dạng problem/solution.' },
  { week: 3, day: 20, isTest: true, title: 'Full mock test lần 3',
    desc: 'Làm đề đầy đủ 4 kỹ năng lần 3 trong tuần. Nếu sắp xếp được, làm thêm 1 buổi mock interview Speaking với người khác để đa dạng phản hồi.' },
  { week: 3, day: 21, isTest: false, title: 'Nghỉ & review error log',
    desc: 'Nghỉ luyện đề nặng. Dành 30-45 phút review lại toàn bộ error log 3 tuần, tách lỗi đã khắc phục và lỗi vẫn lặp lại để ưu tiên xử lý ở tuần 4.' },

  { week: 4, day: 22, isTest: true, title: 'Full mock test lần 1',
    desc: 'Làm đề đầy đủ 4 kỹ năng theo điều kiện thi thật. Chấm ngay, dành buổi tối phân tích lỗi chi tiết từng câu sai.' },
  { week: 4, day: 23, isTest: false, title: 'Luyện đúng dạng yếu nhất',
    desc: 'Không học kiến thức mới nữa. Chỉ luyện đúng dạng câu hỏi/kỹ năng con đang yếu nhất theo checkpoint cả 4 tuần.<br>- <b>Speaking:</b> Trả lời tự nhiên, tránh học thuộc lòng.' },
  { week: 4, day: 24, isTest: true, title: 'Full mock test lần 2',
    desc: 'Làm đề đầy đủ 4 kỹ năng lần 2 trong tuần. So sánh với các lần mock trước để xác nhận mức độ ổn định phong độ.' },
  { week: 4, day: 25, isTest: false, title: 'Fix lỗi lặp lại',
    desc: 'Tập trung xử lý dứt điểm những lỗi đã lặp lại nhiều lần trong error log.<br>- <b>Speaking:</b> Trả lời tự nhiên, không học thuộc câu mẫu để tránh trừ điểm Fluency.' },
  { week: 4, day: 26, isTest: true, title: 'Mock test cuối cùng',
    desc: 'Làm đề đầy đủ 4 kỹ năng, mô phỏng đúng 100% điều kiện phòng thi: không tra từ, không dừng giữa chừng, không tắt âm thanh Listening.' },
  { week: 4, day: 27, isTest: false, title: 'Giảm tải',
    desc: 'Giảm cường độ còn 3-4 giờ/ngày. Chỉ ôn lại vocabulary bank và cấu trúc ngữ pháp hay dùng, không luyện đề nặng để tránh kiệt sức.' },
  { week: 4, day: 28, isTest: false, title: 'Ngày trước thi — Giữ phong độ',
    desc: 'Chỉ ôn nhẹ vài cấu trúc Writing và từ vựng hay dùng, không luyện đề mới. Ưu tiên ngủ đủ giấc, giữ tinh thần thoải mái để vào phòng thi tỉnh táo nhất.' }
];

const STORAGE_KEY = 'ielts-tracker-entries';

let entries = {};
try { entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { entries = {}; }
let activeWeek = 1;
let mainTab = 1;

const VOLS_STORAGE_KEY = 'ielts-tracker-vols';
let vols = {};
try { vols = JSON.parse(localStorage.getItem(VOLS_STORAGE_KEY) || '{}'); } catch (e) { vols = {}; }
let activeVol = 1;

function saveVols() {
  try { localStorage.setItem(VOLS_STORAGE_KEY, JSON.stringify(vols)); } catch (e) { console.error(e); }
}

function getVol(n) {
  if (!vols[n]) vols[n] = { tests: [{}], completed: false };
  return vols[n];
}

function computeVolAverages(volNum) {
  const vol = getVol(volNum);
  const sums = {}, counts = {};
  SKILLS.forEach((s) => { sums[s.key] = 0; counts[s.key] = 0; });
  vol.tests.forEach((test) => {
    SKILLS.forEach((s) => {
      const v = test[s.key];
      if (v !== undefined && v !== null && v !== '') {
        sums[s.key] += parseFloat(v);
        counts[s.key] += 1;
      }
    });
  });
  const avgs = {};
  SKILLS.forEach((s) => { avgs[s.key] = counts[s.key] > 0 ? sums[s.key] / counts[s.key] : null; });
  const validAvgs = SKILLS.map((s) => avgs[s.key]).filter((v) => v !== null);
  let overall = null;
  if (validAvgs.length > 0) {
    const mean = validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length;
    overall = Math.round(mean * 2) / 2;
  }
  return { avgs, overall };
}

function renderVolCompletion() {
  let cells = '';
  for (let n = 1; n <= 10; n++) {
    const v = vols[n];
    const done = !!(v && v.completed);
    const hasData = !done && unitHasData(v);
    const isActive = n === activeVol;
    const fill = done ? 'background:var(--success);border-color:var(--success);color:#fff;'
      : hasData ? 'background:var(--pending);border-color:var(--pending);color:#fff;'
      : '';
    cells += '<div class="summary-cell">'
      + '<div class="summary-badge" data-action="select-vol-number" data-vol="' + n + '" style="cursor:pointer;' + fill + (isActive ? 'box-shadow:0 0 0 2px var(--accent);' : '') + '">'
      + (done ? '✓' : n) + '</div></div>';
  }
  document.getElementById('vol-completion').innerHTML =
    '<div class="week-summary-head"><span style="color:var(--ink-muted)">Hoàn thành</span></div>'
    + '<div class="circle-wrap-grid" style="grid-template-columns:repeat(10,minmax(0,1fr));">' + cells + '</div>'
    + completionLegendHtml();
}

function renderVolTests() {
  const vol = getVol(activeVol);
  const html = vol.tests.map((test, idx) => {
    const bandFields = SKILLS.map((s) => bandFieldHtml(s, test, 'data-vol="' + activeVol + '" data-test="' + idx + '"', 'vol-')).join('');
    const title = 'TEST ' + (idx + 1) + ' / VOL ' + activeVol;
    return '<div class="day-card" id="vol-test-' + idx + '" style="margin-bottom:12px;">'
      + '<button type="button" class="test-delete-btn" data-action="delete-vol-test" data-vol="' + activeVol + '" data-test="' + idx + '">×</button>'
      + '<div class="day-title-row" style="padding-right:28px;"><span class="day-title">' + title + '</span>'
      + dateFieldHtml(test.date, 'vol-', 'data-vol="' + activeVol + '" data-test="' + idx + '"')
      + '</div>'
      + '<div class="band-grid">' + bandFields + '</div>'
      + noteFieldHtml(test.note || '', 'vol-note', 'data-vol="' + activeVol + '" data-test="' + idx + '"', 'Ghi chú cho bài test này…')
      + '</div>';
  }).join('');
  document.getElementById('vol-tests').innerHTML = html;

  document.getElementById('vol-actions').innerHTML =
    '<button type="button" class="week-tab action-add" data-action="add-test" data-vol="' + activeVol + '">+ Thêm ô</button>'
    + '<button type="button" class="week-tab action-end" data-action="end-vol" data-vol="' + activeVol + '">Kết thúc VOL ' + activeVol + '</button>';
}

function renderVolSummary() {
  const vol = getVol(activeVol);
  const wrap = document.getElementById('vol-summary-wrap');
  if (!vol.completed) { wrap.innerHTML = ''; return; }
  const result = computeVolAverages(activeVol);
  const avgs = result.avgs, overall = result.overall;
  const skillCells = SKILLS.map((s) =>
    '<div class="stat-card" style="border-top-color:' + s.color + '">'
    + '<div class="stat-label">' + s.label + '</div>'
    + '<div class="stat-value-row"><span class="stat-value">' + (avgs[s.key] !== null ? avgs[s.key].toFixed(1) : '—') + '</span></div>'
    + '</div>'
  ).join('');
  wrap.innerHTML =
    '<div class="section-label">Tổng hợp VOL ' + activeVol + '</div>'
    + '<div class="stats-grid" style="margin-bottom:12px;">' + skillCells + '</div>'
    + '<div class="card" style="padding:16px; text-align:center;">'
    + '<div class="stat-label">Overall VOL ' + activeVol + '</div>'
    + '<div class="stat-value" style="font-size:28px;">' + (overall !== null ? overall.toFixed(1) : '—') + '</div>'
    + '</div>';
}

function renderVolTestSummary() {
  const vol = getVol(activeVol);
  document.getElementById('vol-test-summary').innerHTML = testSummaryHtml(vol.tests, 'vol-test-');
}

function renderVolSection() {
  renderVolCompletion();
  renderVolTestSummary();
  renderVolTests();
  renderVolSummary();
}

const CAMS_STORAGE_KEY = 'ielts-tracker-cams';
let cams = {};
try { cams = JSON.parse(localStorage.getItem(CAMS_STORAGE_KEY) || '{}'); } catch (e) { cams = {}; }
let activeCam = 1;

function saveCams() {
  try { localStorage.setItem(CAMS_STORAGE_KEY, JSON.stringify(cams)); } catch (e) { console.error(e); }
}

function getCam(n) {
  if (!cams[n]) cams[n] = { tests: [{}], completed: false };
  return cams[n];
}

function computeCamAverages(camNum) {
  const cam = getCam(camNum);
  const sums = {}, counts = {};
  SKILLS.forEach((s) => { sums[s.key] = 0; counts[s.key] = 0; });
  cam.tests.forEach((test) => {
    SKILLS.forEach((s) => {
      const v = test[s.key];
      if (v !== undefined && v !== null && v !== '') {
        sums[s.key] += parseFloat(v);
        counts[s.key] += 1;
      }
    });
  });
  const avgs = {};
  SKILLS.forEach((s) => { avgs[s.key] = counts[s.key] > 0 ? sums[s.key] / counts[s.key] : null; });
  const validAvgs = SKILLS.map((s) => avgs[s.key]).filter((v) => v !== null);
  let overall = null;
  if (validAvgs.length > 0) {
    const mean = validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length;
    overall = Math.round(mean * 2) / 2;
  }
  return { avgs, overall };
}

function renderCamCompletion() {
  let cells = '';
  for (let n = 1; n <= 21; n++) {
    const c = cams[n];
    const done = !!(c && c.completed);
    const hasData = !done && unitHasData(c);
    const isActive = n === activeCam;
    const fill = done ? 'background:var(--success);border-color:var(--success);color:#fff;'
      : hasData ? 'background:var(--pending);border-color:var(--pending);color:#fff;'
      : '';
    cells += '<div class="summary-cell">'
      + '<div class="summary-badge" data-action="select-cam-number" data-cam="' + n + '" style="cursor:pointer;' + fill + (isActive ? 'box-shadow:0 0 0 2px var(--accent);' : '') + '">'
      + (done ? '✓' : n) + '</div></div>';
  }
  document.getElementById('cam-completion').innerHTML =
    '<div class="week-summary-head"><span style="color:var(--ink-muted)">Hoàn thành</span></div>'
    + '<div class="circle-wrap-grid" style="grid-template-columns:repeat(21,minmax(0,1fr));">' + cells + '</div>'
    + completionLegendHtml();
}

function renderCamTests() {
  const cam = getCam(activeCam);
  const html = cam.tests.map((test, idx) => {
    const bandFields = SKILLS.map((s) => bandFieldHtml(s, test, 'data-cam="' + activeCam + '" data-test="' + idx + '"', 'cam-')).join('');
    const title = 'TEST ' + (idx + 1) + ' / CAMBRIDGE ' + activeCam;
    return '<div class="day-card" id="cam-test-' + idx + '" style="margin-bottom:12px;">'
      + '<button type="button" class="test-delete-btn" data-action="delete-cam-test" data-cam="' + activeCam + '" data-test="' + idx + '">×</button>'
      + '<div class="day-title-row" style="padding-right:28px;"><span class="day-title">' + title + '</span>'
      + dateFieldHtml(test.date, 'cam-', 'data-cam="' + activeCam + '" data-test="' + idx + '"')
      + '</div>'
      + '<div class="band-grid">' + bandFields + '</div>'
      + noteFieldHtml(test.note || '', 'cam-note', 'data-cam="' + activeCam + '" data-test="' + idx + '"', 'Ghi chú cho bài test này…')
      + '</div>';
  }).join('');
  document.getElementById('cam-tests').innerHTML = html;

  document.getElementById('cam-actions').innerHTML =
    '<button type="button" class="week-tab action-add" data-action="add-cam-test" data-cam="' + activeCam + '">+ Thêm ô</button>'
    + '<button type="button" class="week-tab action-end" data-action="end-cam" data-cam="' + activeCam + '">Kết thúc Cambridge ' + activeCam + '</button>';
}

function renderCamSummary() {
  const cam = getCam(activeCam);
  const wrap = document.getElementById('cam-summary-wrap');
  if (!cam.completed) { wrap.innerHTML = ''; return; }
  const result = computeCamAverages(activeCam);
  const avgs = result.avgs, overall = result.overall;
  const skillCells = SKILLS.map((s) =>
    '<div class="stat-card" style="border-top-color:' + s.color + '">'
    + '<div class="stat-label">' + s.label + '</div>'
    + '<div class="stat-value-row"><span class="stat-value">' + (avgs[s.key] !== null ? avgs[s.key].toFixed(1) : '—') + '</span></div>'
    + '</div>'
  ).join('');
  wrap.innerHTML =
    '<div class="section-label">Tổng hợp Cambridge ' + activeCam + '</div>'
    + '<div class="stats-grid" style="margin-bottom:12px;">' + skillCells + '</div>'
    + '<div class="card" style="padding:16px; text-align:center;">'
    + '<div class="stat-label">Overall Cambridge ' + activeCam + '</div>'
    + '<div class="stat-value" style="font-size:28px;">' + (overall !== null ? overall.toFixed(1) : '—') + '</div>'
    + '</div>';
}

function renderCamTestSummary() {
  const cam = getCam(activeCam);
  document.getElementById('cam-test-summary').innerHTML = testSummaryHtml(cam.tests, 'cam-test-');
}

function renderCamSection() {
  renderCamCompletion();
  renderCamTestSummary();
  renderCamTests();
  renderCamSummary();
}

const ACTUALS_STORAGE_KEY = 'ielts-tracker-actuals';
let actuals = {};
try { actuals = JSON.parse(localStorage.getItem(ACTUALS_STORAGE_KEY) || '{}'); } catch (e) { actuals = {}; }
let activeActual = 1;

function saveActuals() {
  try { localStorage.setItem(ACTUALS_STORAGE_KEY, JSON.stringify(actuals)); } catch (e) { console.error(e); }
}

function getActual(n) {
  if (!actuals[n]) actuals[n] = { tests: [{}], completed: false };
  return actuals[n];
}

function computeActualAverages(actualNum) {
  const actual = getActual(actualNum);
  const sums = {}, counts = {};
  SKILLS.forEach((s) => { sums[s.key] = 0; counts[s.key] = 0; });
  actual.tests.forEach((test) => {
    SKILLS.forEach((s) => {
      const v = test[s.key];
      if (v !== undefined && v !== null && v !== '') {
        sums[s.key] += parseFloat(v);
        counts[s.key] += 1;
      }
    });
  });
  const avgs = {};
  SKILLS.forEach((s) => { avgs[s.key] = counts[s.key] > 0 ? sums[s.key] / counts[s.key] : null; });
  const validAvgs = SKILLS.map((s) => avgs[s.key]).filter((v) => v !== null);
  let overall = null;
  if (validAvgs.length > 0) {
    const mean = validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length;
    overall = Math.round(mean * 2) / 2;
  }
  return { avgs, overall };
}

function renderActualCompletion() {
  let cells = '';
  for (let n = 1; n <= 6; n++) {
    const c = actuals[n];
    const done = !!(c && c.completed);
    const hasData = !done && unitHasData(c);
    const isActive = n === activeActual;
    const fill = done ? 'background:var(--success);border-color:var(--success);color:#fff;'
      : hasData ? 'background:var(--pending);border-color:var(--pending);color:#fff;'
      : '';
    cells += '<div class="summary-cell">'
      + '<div class="summary-badge" data-action="select-actual-number" data-actual="' + n + '" style="cursor:pointer;' + fill + (isActive ? 'box-shadow:0 0 0 2px var(--accent);' : '') + '">'
      + (done ? '✓' : n) + '</div></div>';
  }
  document.getElementById('actual-completion').innerHTML =
    '<div class="week-summary-head"><span style="color:var(--ink-muted)">Hoàn thành</span></div>'
    + '<div class="circle-wrap-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">' + cells + '</div>'
    + completionLegendHtml();
}

function renderActualTests() {
  const actual = getActual(activeActual);
  const html = actual.tests.map((test, idx) => {
    const bandFields = SKILLS.map((s) => bandFieldHtml(s, test, 'data-actual="' + activeActual + '" data-test="' + idx + '"', 'actual-')).join('');
    const title = 'TEST ' + (idx + 1) + ' / ACTUAL TEST ' + activeActual;
    return '<div class="day-card" id="actual-test-' + idx + '" style="margin-bottom:12px;">'
      + '<button type="button" class="test-delete-btn" data-action="delete-actual-test" data-actual="' + activeActual + '" data-test="' + idx + '">×</button>'
      + '<div class="day-title-row" style="padding-right:28px;"><span class="day-title">' + title + '</span>'
      + dateFieldHtml(test.date, 'actual-', 'data-actual="' + activeActual + '" data-test="' + idx + '"')
      + '</div>'
      + '<div class="band-grid">' + bandFields + '</div>'
      + noteFieldHtml(test.note || '', 'actual-note', 'data-actual="' + activeActual + '" data-test="' + idx + '"', 'Ghi chú cho bài test này…')
      + '</div>';
  }).join('');
  document.getElementById('actual-tests').innerHTML = html;

  document.getElementById('actual-actions').innerHTML =
    '<button type="button" class="week-tab action-add" data-action="add-actual-test" data-actual="' + activeActual + '">+ Thêm ô</button>'
    + '<button type="button" class="week-tab action-end" data-action="end-actual" data-actual="' + activeActual + '">Kết thúc ACTUAL TEST ' + activeActual + '</button>';
}

function renderActualSummary() {
  const actual = getActual(activeActual);
  const wrap = document.getElementById('actual-summary-wrap');
  if (!actual.completed) { wrap.innerHTML = ''; return; }
  const result = computeActualAverages(activeActual);
  const avgs = result.avgs, overall = result.overall;
  const skillCells = SKILLS.map((s) =>
    '<div class="stat-card" style="border-top-color:' + s.color + '">'
    + '<div class="stat-label">' + s.label + '</div>'
    + '<div class="stat-value-row"><span class="stat-value">' + (avgs[s.key] !== null ? avgs[s.key].toFixed(1) : '—') + '</span></div>'
    + '</div>'
  ).join('');
  wrap.innerHTML =
    '<div class="section-label">Tổng hợp ACTUAL TEST ' + activeActual + '</div>'
    + '<div class="stats-grid" style="margin-bottom:12px;">' + skillCells + '</div>'
    + '<div class="card" style="padding:16px; text-align:center;">'
    + '<div class="stat-label">Overall ACTUAL TEST ' + activeActual + '</div>'
    + '<div class="stat-value" style="font-size:28px;">' + (overall !== null ? overall.toFixed(1) : '—') + '</div>'
    + '</div>';
}

function renderActualTestSummary() {
  const actual = getActual(activeActual);
  document.getElementById('actual-test-summary').innerHTML = testSummaryHtml(actual.tests, 'actual-test-');
}

function renderActualSection() {
  renderActualCompletion();
  renderActualTestSummary();
  renderActualTests();
  renderActualSummary();
}
const MOCKS_STORAGE_KEY = 'ielts-tracker-mocks';
let mocks = {};
try { mocks = JSON.parse(localStorage.getItem(MOCKS_STORAGE_KEY) || '{}'); } catch (e) { mocks = {}; }
let activeMock = 1;

function saveMocks() {
  try { localStorage.setItem(MOCKS_STORAGE_KEY, JSON.stringify(mocks)); } catch (e) { console.error(e); }
}

function getMock(n) {
  if (!mocks[n]) mocks[n] = { tests: [{}], completed: false };
  return mocks[n];
}

function computeMockAverages(mockNum) {
  const mock = getMock(mockNum);
  const sums = {}, counts = {};
  SKILLS.forEach((s) => { sums[s.key] = 0; counts[s.key] = 0; });
  mock.tests.forEach((test) => {
    SKILLS.forEach((s) => {
      const v = test[s.key];
      if (v !== undefined && v !== null && v !== '') {
        sums[s.key] += parseFloat(v);
        counts[s.key] += 1;
      }
    });
  });
  const avgs = {};
  SKILLS.forEach((s) => { avgs[s.key] = counts[s.key] > 0 ? sums[s.key] / counts[s.key] : null; });
  const validAvgs = SKILLS.map((s) => avgs[s.key]).filter((v) => v !== null);
  let overall = null;
  if (validAvgs.length > 0) {
    const mean = validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length;
    overall = Math.round(mean * 2) / 2;
  }
  return { avgs, overall };
}

function renderMockCompletion() {
  let cells = '';
  for (let n = 1; n <= 20; n++) {
    const c = mocks[n];
    const done = !!(c && c.completed);
    const hasData = !done && unitHasData(c);
    const isActive = n === activeMock;
    const fill = done ? 'background:var(--success);border-color:var(--success);color:#fff;'
      : hasData ? 'background:var(--pending);border-color:var(--pending);color:#fff;'
      : '';
    cells += '<div class="summary-cell">'
      + '<div class="summary-badge" data-action="select-mock-number" data-mock="' + n + '" style="cursor:pointer;' + fill + (isActive ? 'box-shadow:0 0 0 2px var(--accent);' : '') + '">'
      + (done ? '✓' : n) + '</div></div>';
  }
  document.getElementById('mock-completion').innerHTML =
    '<div class="week-summary-head"><span style="color:var(--ink-muted)">Hoàn thành</span></div>'
    + '<div class="circle-wrap-grid" style="grid-template-columns:repeat(20,minmax(0,1fr));">' + cells + '</div>'
    + completionLegendHtml();
}

function renderMockTests() {
  const mock = getMock(activeMock);
  const html = mock.tests.map((test, idx) => {
    const bandFields = SKILLS.map((s) => bandFieldHtml(s, test, 'data-mock="' + activeMock + '" data-test="' + idx + '"', 'mock-')).join('');
    const title = 'TEST ' + (idx + 1) + ' / MOCK TEST ' + activeMock;
    return '<div class="day-card" id="mock-test-' + idx + '" style="margin-bottom:12px;">'
      + '<button type="button" class="test-delete-btn" data-action="delete-mock-test" data-mock="' + activeMock + '" data-test="' + idx + '">×</button>'
      + '<div class="day-title-row" style="padding-right:28px;"><span class="day-title">' + title + '</span>'
      + dateFieldHtml(test.date, 'mock-', 'data-mock="' + activeMock + '" data-test="' + idx + '"')
      + '</div>'
      + '<div class="band-grid">' + bandFields + '</div>'
      + noteFieldHtml(test.note || '', 'mock-note', 'data-mock="' + activeMock + '" data-test="' + idx + '"', 'Ghi chú cho bài test này…')
      + '</div>';
  }).join('');
  document.getElementById('mock-tests').innerHTML = html;

  document.getElementById('mock-actions').innerHTML =
    '<button type="button" class="week-tab action-add" data-action="add-mock-test" data-mock="' + activeMock + '">+ Thêm ô</button>'
    + '<button type="button" class="week-tab action-end" data-action="end-mock" data-mock="' + activeMock + '">Kết thúc MOCK TEST ' + activeMock + '</button>';
}

function renderMockSummary() {
  const mock = getMock(activeMock);
  const wrap = document.getElementById('mock-summary-wrap');
  if (!mock.completed) { wrap.innerHTML = ''; return; }
  const result = computeMockAverages(activeMock);
  const avgs = result.avgs, overall = result.overall;
  const skillCells = SKILLS.map((s) =>
    '<div class="stat-card" style="border-top-color:' + s.color + '">'
    + '<div class="stat-label">' + s.label + '</div>'
    + '<div class="stat-value-row"><span class="stat-value">' + (avgs[s.key] !== null ? avgs[s.key].toFixed(1) : '—') + '</span></div>'
    + '</div>'
  ).join('');
  wrap.innerHTML =
    '<div class="section-label">Tổng hợp MOCK TEST ' + activeMock + '</div>'
    + '<div class="stats-grid" style="margin-bottom:12px;">' + skillCells + '</div>'
    + '<div class="card" style="padding:16px; text-align:center;">'
    + '<div class="stat-label">Overall MOCK TEST ' + activeMock + '</div>'
    + '<div class="stat-value" style="font-size:28px;">' + (overall !== null ? overall.toFixed(1) : '—') + '</div>'
    + '</div>';
}

function renderMockTestSummary() {
  const mock = getMock(activeMock);
  document.getElementById('mock-test-summary').innerHTML = testSummaryHtml(mock.tests, 'mock-test-');
}

function renderMockSection() {
  renderMockCompletion();
  renderMockTestSummary();
  renderMockTests();
  renderMockSummary();
}
const PRACTICEC_STORAGE_KEY = 'ielts-tracker-practicec';
let practicecs = {};
try { practicecs = JSON.parse(localStorage.getItem(PRACTICEC_STORAGE_KEY) || '{}'); } catch (e) { practicecs = {}; }
let activePracticeC = 1;

function savePracticeCs() {
  try { localStorage.setItem(PRACTICEC_STORAGE_KEY, JSON.stringify(practicecs)); } catch (e) { console.error(e); }
}

function getPracticeC(n) {
  if (!practicecs[n]) practicecs[n] = { tests: [{}], completed: false };
  return practicecs[n];
}

function computePracticeCAverages(pcNum) {
  const pc = getPracticeC(pcNum);
  const sums = {}, counts = {};
  SKILLS.forEach((s) => { sums[s.key] = 0; counts[s.key] = 0; });
  pc.tests.forEach((test) => {
    SKILLS.forEach((s) => {
      const v = test[s.key];
      if (v !== undefined && v !== null && v !== '') {
        sums[s.key] += parseFloat(v);
        counts[s.key] += 1;
      }
    });
  });
  const avgs = {};
  SKILLS.forEach((s) => { avgs[s.key] = counts[s.key] > 0 ? sums[s.key] / counts[s.key] : null; });
  const validAvgs = SKILLS.map((s) => avgs[s.key]).filter((v) => v !== null);
  let overall = null;
  if (validAvgs.length > 0) {
    const mean = validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length;
    overall = Math.round(mean * 2) / 2;
  }
  return { avgs, overall };
}

function renderPracticeCCompletion() {
  let cells = '';
  for (let n = 1; n <= 3; n++) {
    const c = practicecs[n];
    const done = !!(c && c.completed);
    const hasData = !done && unitHasData(c);
    const isActive = n === activePracticeC;
    const fill = done ? 'background:var(--success);border-color:var(--success);color:#fff;'
      : hasData ? 'background:var(--pending);border-color:var(--pending);color:#fff;'
      : '';
    cells += '<div class="summary-cell">'
      + '<div class="summary-badge" data-action="select-practicec-number" data-practicec="' + n + '" style="cursor:pointer;' + fill + (isActive ? 'box-shadow:0 0 0 2px var(--accent);' : '') + '">'
      + (done ? '✓' : n) + '</div></div>';
  }
  document.getElementById('practicec-completion').innerHTML =
    '<div class="week-summary-head"><span style="color:var(--ink-muted)">Hoàn thành</span></div>'
    + '<div class="circle-wrap-grid" style="grid-template-columns:repeat(3,minmax(0,1fr));">' + cells + '</div>'
    + completionLegendHtml();
}

function renderPracticeCTests() {
  const pc = getPracticeC(activePracticeC);
  const html = pc.tests.map((test, idx) => {
    const bandFields = SKILLS.map((s) => bandFieldHtml(s, test, 'data-practicec="' + activePracticeC + '" data-test="' + idx + '"', 'practicec-')).join('');
    const title = 'TEST ' + (idx + 1) + ' / PRACTICE C' + String(activePracticeC).padStart(2, '0');
    return '<div class="day-card" id="practicec-test-' + idx + '" style="margin-bottom:12px;">'
      + '<button type="button" class="test-delete-btn" data-action="delete-practicec-test" data-practicec="' + activePracticeC + '" data-test="' + idx + '">×</button>'
      + '<div class="day-title-row" style="padding-right:28px;"><span class="day-title">' + title + '</span>'
      + dateFieldHtml(test.date, 'practicec-', 'data-practicec="' + activePracticeC + '" data-test="' + idx + '"')
      + '</div>'
      + '<div class="band-grid">' + bandFields + '</div>'
      + noteFieldHtml(test.note || '', 'practicec-note', 'data-practicec="' + activePracticeC + '" data-test="' + idx + '"', 'Ghi chú cho bài test này…')
      + '</div>';
  }).join('');
  document.getElementById('practicec-tests').innerHTML = html;

  document.getElementById('practicec-actions').innerHTML =
    '<button type="button" class="week-tab action-add" data-action="add-practicec-test" data-practicec="' + activePracticeC + '">+ Thêm ô</button>'
    + '<button type="button" class="week-tab action-end" data-action="end-practicec" data-practicec="' + activePracticeC + '">Kết thúc PRACTICE C ' + activePracticeC + '</button>';
}

function renderPracticeCSummary() {
  const pc = getPracticeC(activePracticeC);
  const wrap = document.getElementById('practicec-summary-wrap');
  if (!pc.completed) { wrap.innerHTML = ''; return; }
  const result = computePracticeCAverages(activePracticeC);
  const avgs = result.avgs, overall = result.overall;
  const skillCells = SKILLS.map((s) =>
    '<div class="stat-card" style="border-top-color:' + s.color + '">'
    + '<div class="stat-label">' + s.label + '</div>'
    + '<div class="stat-value-row"><span class="stat-value">' + (avgs[s.key] !== null ? avgs[s.key].toFixed(1) : '—') + '</span></div>'
    + '</div>'
  ).join('');
  wrap.innerHTML =
    '<div class="section-label">Tổng hợp PRACTICE C ' + activePracticeC + '</div>'
    + '<div class="stats-grid" style="margin-bottom:12px;">' + skillCells + '</div>'
    + '<div class="card" style="padding:16px; text-align:center;">'
    + '<div class="stat-label">Overall PRACTICE C ' + activePracticeC + '</div>'
    + '<div class="stat-value" style="font-size:28px;">' + (overall !== null ? overall.toFixed(1) : '—') + '</div>'
    + '</div>';
}

function renderPracticeCTestSummary() {
  const pc = getPracticeC(activePracticeC);
  document.getElementById('practicec-test-summary').innerHTML = testSummaryHtml(pc.tests, 'practicec-test-');
}

function renderPracticeCSection() {
  renderPracticeCCompletion();
  renderPracticeCTestSummary();
  renderPracticeCTests();
  renderPracticeCSummary();
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch (e) { console.error(e); }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

function ddmmyyyyToIso(str) {
  if (!str) return '';
  const parts = str.split('/');
  if (parts.length !== 3) return '';
  const dd = parts[0].padStart(2, '0'), mm = parts[1].padStart(2, '0'), yyyy = parts[2];
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return '';
  return yyyy + '-' + mm + '-' + dd;
}

function isoToDdmmyyyy(str) {
  if (!str) return '';
  const parts = str.split('-');
  if (parts.length !== 3) return '';
  const yyyy = parts[0], mm = parts[1], dd = parts[2];
  return dd + '/' + mm + '/' + yyyy;
}

function formatDateTyping(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
}

function currentBand() {
  const result = {};
  SKILLS.forEach((s) => { result[s.key] = null; });
  for (let d = 1; d <= 28; d++) {
    const e = entries[d];
    if (!e) continue;
    SKILLS.forEach((s) => {
      const v = e[s.key];
      if (v !== undefined && v !== null && v !== '') {
        result[s.key] = { value: parseFloat(v), day: d };
      }
    });
  }
  return result;
}

function weekChartData() {
  const data = [{
    x: 0,
    listening: SKILLS[0].baseline,
    reading: SKILLS[1].baseline,
    writing: SKILLS[2].baseline,
    speaking: SKILLS[3].baseline,
  }];
  for (let d = 1; d <= 28; d++) {
    const e = entries[d];
    if (!e) continue;
    const point = { x: d };
    let hasAny = false;
    SKILLS.forEach((s) => {
      const v = e[s.key];
      if (v !== undefined && v !== null && v !== '') {
        point[s.key] = parseFloat(v);
        hasAny = true;
      }
    });
    if (hasAny) data.push(point);
  }
  return data;
}

function volChartData() {
  const data = [{
    x: 0,
    listening: SKILLS[0].baseline,
    reading: SKILLS[1].baseline,
    writing: SKILLS[2].baseline,
    speaking: SKILLS[3].baseline,
  }];
  for (let n = 1; n <= 9; n++) {
    if (!vols[n]) continue;
    const avgs = computeVolAverages(n).avgs;
    const point = { x: n };
    let hasAny = false;
    SKILLS.forEach((s) => {
      if (avgs[s.key] !== null) { point[s.key] = avgs[s.key]; hasAny = true; }
    });
    if (hasAny) data.push(point);
  }
  return data;
}

function camChartData() {
  const data = [{
    x: 0,
    listening: SKILLS[0].baseline,
    reading: SKILLS[1].baseline,
    writing: SKILLS[2].baseline,
    speaking: SKILLS[3].baseline,
  }];
  for (let n = 1; n <= 21; n++) {
    if (!cams[n]) continue;
    const avgs = computeCamAverages(n).avgs;
    const point = { x: n };
    let hasAny = false;
    SKILLS.forEach((s) => {
      if (avgs[s.key] !== null) { point[s.key] = avgs[s.key]; hasAny = true; }
    });
    if (hasAny) data.push(point);
  }
  return data;
}

function actualChartData() {
  const data = [{
    x: 0,
    listening: SKILLS[0].baseline,
    reading: SKILLS[1].baseline,
    writing: SKILLS[2].baseline,
    speaking: SKILLS[3].baseline,
  }];
  for (let n = 1; n <= 6; n++) {
    if (!actuals[n]) continue;
    const avgs = computeActualAverages(n).avgs;
    const point = { x: n };
    let hasAny = false;
    SKILLS.forEach((s) => {
      if (avgs[s.key] !== null) { point[s.key] = avgs[s.key]; hasAny = true; }
    });
    if (hasAny) data.push(point);
  }
  return data;
}

function mockChartData() {
  const data = [{
    x: 0,
    listening: SKILLS[0].baseline,
    reading: SKILLS[1].baseline,
    writing: SKILLS[2].baseline,
    speaking: SKILLS[3].baseline,
  }];
  for (let n = 1; n <= 20; n++) {
    if (!mocks[n]) continue;
    const avgs = computeMockAverages(n).avgs;
    const point = { x: n };
    let hasAny = false;
    SKILLS.forEach((s) => {
      if (avgs[s.key] !== null) { point[s.key] = avgs[s.key]; hasAny = true; }
    });
    if (hasAny) data.push(point);
  }
  return data;
}

function practicecChartData() {
  const data = [{
    x: 0,
    listening: SKILLS[0].baseline,
    reading: SKILLS[1].baseline,
    writing: SKILLS[2].baseline,
    speaking: SKILLS[3].baseline,
  }];
  for (let n = 1; n <= 3; n++) {
    if (!practicecs[n]) continue;
    const avgs = computePracticeCAverages(n).avgs;
    const point = { x: n };
    let hasAny = false;
    SKILLS.forEach((s) => {
      if (avgs[s.key] !== null) { point[s.key] = avgs[s.key]; hasAny = true; }
    });
    if (hasAny) data.push(point);
  }
  return data;
}

function renderHeader() {
  const completedCount = Object.values(entries).filter((e) => e && e.completed).length;
  document.getElementById('header-sub').textContent =
    'Overall 6.0 → 8.0 trong 1 tháng · ' + completedCount + '/28 ngày đã đánh dấu hoàn thành';
}

function renderStats() {
  const grid = document.getElementById('stats-grid');
  let html = SKILLS.map((s) => {
    const curVal = s.baseline;

    return '<div class="stat-card" style="border-top-color:' + s.color + '; display:flex; flex-direction:column; justify-content:center;">'
      + '<div class="stat-label">' + s.label + '</div>'
      + '<div class="stat-value-row"><span class="stat-value">' + curVal.toFixed(1) + '</span>'
      + '<span class="stat-target">/ ' + s.target.toFixed(1) + '</span></div>'
      + '</div>';
  }).join('');
  html += '<div class="stat-card" style="border-top-color:var(--accent); display:flex; flex-direction:column; justify-content:center;">'
    + '<div class="stat-label">Overall</div>'
    + '<div class="stat-value-row"><span class="stat-value">' + OVERALL_BASELINE.toFixed(1) + '</span>'
    + '<span class="stat-target">/ ' + OVERALL_TARGET.toFixed(1) + '</span></div>'
    + '</div>';
  grid.innerHTML = html;
}

function aggregateSkillAverages(kind) {
  const sums = {}, counts = {};
  SKILLS.forEach((s) => { sums[s.key] = 0; counts[s.key] = 0; });

  if (kind === 'week') {
    for (let d = 1; d <= 28; d++) {
      const e = entries[d];
      if (!e) continue;
      SKILLS.forEach((s) => {
        const v = e[s.key];
        if (v !== undefined && v !== null && v !== '') {
          sums[s.key] += parseFloat(v);
          counts[s.key] += 1;
        }
      });
    }
  } else {
    const KIND_MAP = { cam: { store: cams, max: 21 }, vol: { store: vols, max: 9 }, actual: { store: actuals, max: 6 }, mock: { store: mocks, max: 20 }, practicec: { store: practicecs, max: 3 } };
    const store = KIND_MAP[kind].store;
    const max = KIND_MAP[kind].max;
    for (let n = 1; n <= max; n++) {
      const unit = store[n];
      if (!unit) continue;
      unit.tests.forEach((test) => {
        SKILLS.forEach((s) => {
          const v = test[s.key];
          if (v !== undefined && v !== null && v !== '') {
            sums[s.key] += parseFloat(v);
            counts[s.key] += 1;
          }
        });
      });
    }
  }

  const avgs = {};
  SKILLS.forEach((s) => { avgs[s.key] = counts[s.key] > 0 ? Math.round((sums[s.key] / counts[s.key]) * 2) / 2 : null; });
  return avgs;
}

function renderCategoryAverages() {
  const categories = [
    { key: 'cam', label: 'Cambridge' },
    { key: 'vol', label: 'VOL' },
    { key: 'actual', label: 'Actual Test' },
    { key: 'mock', label: 'Mock Test' },
    { key: 'practicec', label: 'Practice C' },
    { key: 'week', label: '4 tuần' },
  ];
  const html = categories.map((cat) => {
    const avgs = aggregateSkillAverages(cat.key);
    const rows = SKILLS.map((s) => {
      const avgVal = avgs[s.key];
      let deltaHtml = '';
      if (avgVal !== null) {
        const delta = Math.round((avgVal - s.baseline) * 10) / 10;
        if (delta !== 0) {
          const deltaColor = delta > 0 ? 'var(--success)' : 'var(--danger)';
          const arrow = delta > 0 ? '▲' : '▼';
          const deltaText = (delta > 0 ? '+' : '') + delta.toFixed(1) + ' so với baseline';
          deltaHtml = '<div style="font-size:11px; margin-top:2px; color:' + deltaColor + '">' + arrow + ' ' + deltaText + '</div>';
        }
      }
      return '<div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">'
        + '<span style="font-size:12px; font-weight:600; color:' + s.color + ';">' + s.label + '</span>'
        + '<div style="text-align:right;">'
        + '<div class="stat-value-row" style="margin-top:0; justify-content:flex-end;"><span class="stat-value">' + (avgVal !== null ? avgVal.toFixed(1) : '—') + '</span><span class="stat-target">/ ' + s.target.toFixed(1) + '</span></div>'
        + deltaHtml
        + '</div>'
        + '</div>';
    }).join('');
    return '<div class="card" style="padding:14px;">'
      + '<div class="stat-label" style="margin-bottom:6px;">' + cat.label + '</div>'
      + rows
      + '</div>';
  }).join('');

  document.getElementById('category-averages').innerHTML = html;
}

function buildMiniChartSVG(data, xMax, xTicks) {
  const W = 260, H = 190;
  const marginLeft = 26, marginRight = 8, marginTop = 8, marginBottom = 18;
  const plotW = W - marginLeft - marginRight;
  const plotH = H - marginTop - marginBottom;
  const xScale = (x) => marginLeft + (x / xMax) * plotW;
  const yScale = (val) => marginTop + (1 - (val - 4) / 5) * plotH;

  let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="190" style="display:block;">';

  for (let v = 4; v <= 9; v++) {
    const y = yScale(v);
    svg += '<line x1="' + marginLeft + '" y1="' + y + '" x2="' + (W - marginRight) + '" y2="' + y + '" stroke="#E5EAF3" stroke-width="1" />';
    svg += '<text x="' + (marginLeft - 6) + '" y="' + (y + 3) + '" text-anchor="end" font-size="8" fill="#6B7690" font-family="Inter, sans-serif">' + v + '</text>';
  }
  xTicks.forEach((xt) => {
    const x = xScale(xt);
    svg += '<text x="' + x + '" y="' + (H - 4) + '" text-anchor="middle" font-size="8" fill="#6B7690" font-family="Inter, sans-serif">' + xt + '</text>';
  });
  svg += '<line x1="' + marginLeft + '" y1="' + marginTop + '" x2="' + marginLeft + '" y2="' + (H - marginBottom) + '" stroke="#C9D2E3" />';
  svg += '<line x1="' + marginLeft + '" y1="' + (H - marginBottom) + '" x2="' + (W - marginRight) + '" y2="' + (H - marginBottom) + '" stroke="#C9D2E3" />';

  SKILLS.forEach((s) => {
    const y = yScale(s.target);
    svg += '<line x1="' + marginLeft + '" y1="' + y + '" x2="' + (W - marginRight) + '" y2="' + y + '" stroke="' + s.color + '" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.5" />';
  });

  SKILLS.forEach((s, i) => {
    const filtered = data.filter((d) => d[s.key] !== undefined);
    if (filtered.length > 1) {
      const pointsAttr = filtered.map((d) => xScale(d.x) + ',' + yScale(d[s.key])).join(' ');
      svg += '<polyline points="' + pointsAttr + '" fill="none" stroke="' + s.color + '" stroke-width="1.6" />';
    }
    const r = 4.5 - i * 0.7;
    filtered.forEach((d) => {
      const cx = xScale(d.x), cy = yScale(d[s.key]);
      const label = s.label + ' · ' + (d.x === 0 ? 'Baseline' : '#' + d.x) + ' · ' + d[s.key].toFixed(1);
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + s.color + '" stroke="#FFFFFF" stroke-width="1"><title>' + label + '</title></circle>';
    });
  });

  svg += '</svg>';
  return svg;
}

function skillRemark(skillKey, categoryKey) {
  const DATA_FNS = { cam: camChartData, vol: volChartData, actual: actualChartData, mock: mockChartData, practicec: practicecChartData, week: weekChartData };
  const data = (DATA_FNS[categoryKey] || weekChartData)();
  const filtered = data.filter((d) => d[skillKey] !== undefined);
  const skill = SKILLS.find((s) => s.key === skillKey);
  if (filtered.length <= 1) return 'Chưa có đủ dữ liệu để nhận xét xu hướng.';

  const values = filtered.map((d) => d[skillKey]);
  const first = values[0];
  const last = values[values.length - 1];
  const overallDelta = Math.round((last - first) * 10) / 10;

  let increases = 0, decreases = 0;
  for (let i = 1; i < values.length; i++) {
    const diff = Math.round((values[i] - values[i - 1]) * 100) / 100;
    if (diff > 0) increases++;
    else if (diff < 0) decreases++;
  }

  let trendText;
  if (increases > 0 && decreases === 0) {
    trendText = 'tăng đều qua các lần đo (' + first.toFixed(1) + ' → ' + last.toFixed(1) + ')';
  } else if (decreases > 0 && increases === 0) {
    trendText = 'giảm dần qua các lần đo (' + first.toFixed(1) + ' → ' + last.toFixed(1) + '), cần xem lại phương pháp ôn tập';
  } else if (increases > 0 && decreases > 0) {
    trendText = overallDelta >= 0
      ? 'dao động lên xuống nhưng nhìn chung vẫn nhích lên (' + first.toFixed(1) + ' → ' + last.toFixed(1) + ')'
      : 'dao động lên xuống và đang nghiêng về xu hướng giảm (' + first.toFixed(1) + ' → ' + last.toFixed(1) + '), cần ổn định lại phong độ';
  } else {
    trendText = 'chưa có biến động, vẫn đứng yên ở mức ' + last.toFixed(1);
  }

  const gap = Math.round((skill.target - last) * 10) / 10;
  const gapText = gap <= 0 ? 'đã đạt mục tiêu'
    : gap <= 0.5 ? 'rất gần mục tiêu (còn ' + gap.toFixed(1) + ')'
    : gap <= 1.5 ? 'còn cách mục tiêu ' + gap.toFixed(1)
    : 'còn cách mục tiêu khá xa (' + gap.toFixed(1) + ')';

  return trendText + ' · ' + gapText + '.';
}

function renderCommentary() {
  const categories = [
    { key: 'cam', label: 'Cambridge' },
    { key: 'vol', label: 'VOL' },
    { key: 'actual', label: 'Actual Test' },
    { key: 'mock', label: 'Mock Test' },
    { key: 'practicec', label: 'Practice C' },
    { key: 'week', label: '4 tuần học' },
  ];
  const cols = categories.map((cat) => {
    const lines = SKILLS.map((s) =>
      '<div style="margin-bottom:8px; font-size:12px; line-height:1.5;">'
      + '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + s.color + ';margin-right:6px;"></span>'
      + '<span style="font-weight:600; color:var(--ink);">' + s.label + ':</span> '
      + '<span style="color:var(--ink-muted);">' + skillRemark(s.key, cat.key) + '</span>'
      + '</div>'
    ).join('');
    return '<div class="commentary-cell">'
      + '<div style="font-size:12px; font-weight:600; margin-bottom:8px; color:var(--ink);">' + cat.label + '</div>'
      + lines + '</div>';
  }).join('');
  document.getElementById('chart-commentary').innerHTML =
    '<div class="section-label" style="margin-bottom:12px;">Nhận xét</div>'
    + '<div class="commentary-grid">' + cols + '</div>';
}

function renderLegend() {
  const skillItems = SKILLS.map((s, i) =>
    '<span class="legend-item" style="grid-row:1; grid-column:' + (i + 1) + ';"><span class="legend-dot" style="background:' + s.color + '"></span>' + s.label + '</span>'
  ).join('');
  document.getElementById('legend-grid').innerHTML = skillItems;
}

const CATEGORY_TABS = ['cam', 'vol', 'actual', 'mock', 'practicec'];

function renderMainTabs() {
  let html = '<button type="button" class="week-tab' + (mainTab === 'cam' ? ' active' : '') + '" data-action="select-tab" data-tab="cam">Cambridge</button>';
  html += '<button type="button" class="week-tab' + (mainTab === 'vol' ? ' active' : '') + '" data-action="select-tab" data-tab="vol">VOL</button>';
  html += '<button type="button" class="week-tab' + (mainTab === 'actual' ? ' active' : '') + '" data-action="select-tab" data-tab="actual">Actual Test</button>';
  html += '<button type="button" class="week-tab' + (mainTab === 'mock' ? ' active' : '') + '" data-action="select-tab" data-tab="mock">Mock Test</button>';
  html += '<button type="button" class="week-tab' + (mainTab === 'practicec' ? ' active' : '') + '" data-action="select-tab" data-tab="practicec">Practice C</button>';
  for (let w = 1; w <= 4; w++) {
    html += '<button type="button" class="week-tab' + (mainTab === w ? ' active' : '') + '" data-action="select-tab" data-tab="' + w + '">Tuần ' + w + '</button>';
  }
  document.getElementById('main-tabs').innerHTML = html;

  const camContent = document.getElementById('cam-content');
  const volContent = document.getElementById('vol-content');
  const actualContent = document.getElementById('actual-content');
  const mockContent = document.getElementById('mock-content');
  const practiceCContent = document.getElementById('practicec-content');
  const weekContent = document.getElementById('week-content');
  const caption = document.getElementById('week-caption');
  const isCategoryTab = CATEGORY_TABS.indexOf(mainTab) !== -1;

  camContent.style.display = mainTab === 'cam' ? '' : 'none';
  volContent.style.display = mainTab === 'vol' ? '' : 'none';
  actualContent.style.display = mainTab === 'actual' ? '' : 'none';
  mockContent.style.display = mainTab === 'mock' ? '' : 'none';
  practiceCContent.style.display = mainTab === 'practicec' ? '' : 'none';
  weekContent.style.display = !isCategoryTab ? '' : 'none';

  if (isCategoryTab) {
    caption.textContent = '';
  } else {
    activeWeek = mainTab;
    caption.textContent = WEEK_LABELS[activeWeek];
  }
}

function renderWeekSummary() {
  const days = PLAN.filter((d) => d.week === activeWeek);
  const doneCount = days.filter((d) => entries[d.day] && entries[d.day].completed).length;
  const cells = days.map((d) => {
    const done = !!(entries[d.day] && entries[d.day].completed);
    return '<div class="summary-cell">'
      + '<div class="summary-badge' + (done ? ' done' : '') + '" data-action="scroll-to-test" data-target="day-content-' + d.day + '" style="cursor:pointer;">' + (done ? '✓' : d.day) + '</div>'
      + '<div class="summary-test-dot" style="background:' + (d.isTest ? 'var(--accent)' : 'transparent') + '"></div>'
      + '</div>';
  }).join('');
  document.getElementById('week-summary').innerHTML =
    '<div class="week-summary-head"><span style="color:var(--ink-muted)">Hoàn thành tuần ' + activeWeek + '</span>'
    + '<span class="week-summary-count">' + doneCount + '/' + days.length + '</span></div>'
    + '<div class="week-summary-grid">' + cells + '</div>';
}

function renderDayList() {
  const days = PLAN.filter((d) => d.week === activeWeek);
  const html = days.map((d, idx) => {
    const e = entries[d.day] || {};
    const done = !!e.completed;
    const isLast = idx === days.length - 1;
    const descContent = e.desc !== undefined ? e.desc : d.desc;
    const bandFields = SKILLS.map((s) => bandFieldHtml(s, e, 'data-day="' + d.day + '"', '')).join('');
    return '<div class="day-row">'
      + (!isLast ? '<div class="day-line"></div>' : '')
      + '<div class="day-badge' + (done ? ' done' : '') + '">' + (done ? '✓' : d.day) + '</div>'
      + '<div class="day-card" id="day-content-' + d.day + '">'
      + '<div class="day-title-row"><span class="day-title">' + d.title + '</span>'
      + (d.isTest ? '<span class="test-badge">TEST</span>' : '') + '</div>'
      + '<div class="day-desc-wrap" data-day="' + d.day + '">'
      + '<div class="day-desc" data-action="edit-day-desc" data-day="' + d.day + '">' + descContent + '</div>'
      + '</div>'
      + '<label class="done-toggle"><input type="checkbox" ' + (done ? 'checked' : '') + ' data-day="' + d.day + '" data-kind="toggle" /> Đã học xong</label>'
      + '<div class="band-grid">' + bandFields + '</div>'
      + noteFieldHtml(e.note || '', 'note', 'data-day="' + d.day + '"', 'Ghi chú cho ngày này…')
      + '</div></div>';
  }).join('');
  document.getElementById('day-list').innerHTML = html;
}

function dayDescEditorHtml(day, content) {
  return '<div class="day-desc-editable" contenteditable="true" data-day="' + day + '">' + content + '</div>'
    + '<div class="day-desc-save-row"><button type="button" class="day-desc-save-btn" data-action="save-day-desc" data-day="' + day + '">Lưu</button></div>';
}

function normalizeDayDescHtml(html) {
  let out = html;
  out = out.replace(/<(div|p)>\s*<br\s*\/?>\s*<\/(div|p)>/gi, '<br>');
  out = out.replace(/<(div|p)>/gi, '<br>');
  out = out.replace(/<\/(div|p)>/gi, '');
  out = out.replace(/^(<br\s*\/?>\s*)+/i, '');
  out = out.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
  return out.trim();
}

function renderCharts() {
  document.getElementById('chart-cam').innerHTML = buildMiniChartSVG(camChartData(), 21, [0, 7, 14, 21]);
  document.getElementById('chart-vol').innerHTML = buildMiniChartSVG(volChartData(), 9, [0, 3, 6, 9]);
  document.getElementById('chart-actual').innerHTML = buildMiniChartSVG(actualChartData(), 6, [0, 2, 4, 6]);
  document.getElementById('chart-mock').innerHTML = buildMiniChartSVG(mockChartData(), 20, [0, 5, 10, 15, 20]);
  document.getElementById('chart-practicec').innerHTML = buildMiniChartSVG(practicecChartData(), 3, [0, 1, 2, 3]);
  document.getElementById('chart-week').innerHTML = buildMiniChartSVG(weekChartData(), 28, [0, 7, 14, 21, 28]);
  renderCommentary();
}

function renderAll() {
  renderHeader();
  renderStats();
  renderCategoryAverages();
  renderCharts();
  renderLegend();
  renderCamSection();
  renderVolSection();
  renderActualSection();
  renderMockSection();
  renderPracticeCSection();
  renderMainTabs();
  renderWeekSummary();
  renderDayList();
}

document.addEventListener('input', (ev) => {
  const t = ev.target;
  if (!t.dataset) return;
  if (t.dataset.kind === 'band') {
    const day = t.dataset.day, field = t.dataset.field;
    entries[day] = entries[day] || {};
    entries[day][field] = t.value;
    save();
    renderStats();
    renderCategoryAverages();
    renderCharts();
  } else if (t.dataset.kind === 'sub') {
    const day = t.dataset.day, field = t.dataset.field, sub = t.dataset.sub;
    entries[day] = entries[day] || {};
    entries[day][field + sub] = t.value;
    const band = computeSubBand(entries[day], field);
    entries[day][field] = band !== null ? String(band) : '';
    save();
    renderStats();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'note') {
    const day = t.dataset.day;
    entries[day] = entries[day] || {};
    entries[day].note = t.innerHTML;
    save();
  } else if (t.dataset.kind === 'vol-band') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field;
    const vol = getVol(v);
    vol.tests[ti] = vol.tests[ti] || {};
    vol.tests[ti][field] = t.value;
    saveVols();
    renderVolSummary();
    renderVolTestSummary();
    renderCategoryAverages();
    renderCharts();
  } else if (t.dataset.kind === 'vol-sub') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field, sub = t.dataset.sub;
    const vol = getVol(v);
    vol.tests[ti] = vol.tests[ti] || {};
    vol.tests[ti][field + sub] = t.value;
    const band = computeSubBand(vol.tests[ti], field);
    vol.tests[ti][field] = band !== null ? String(band) : '';
    saveVols();
    renderVolSummary();
    renderVolTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'vol-note') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10);
    const vol = getVol(v);
    vol.tests[ti] = vol.tests[ti] || {};
    vol.tests[ti].note = t.innerHTML;
    saveVols();
  } else if (t.dataset.kind === 'vol-date') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10);
    const vol = getVol(v);
    vol.tests[ti] = vol.tests[ti] || {};
    vol.tests[ti].date = isoToDdmmyyyy(t.value);
    saveVols();
    renderVolTests();
  } else if (t.dataset.kind === 'vol-date-text') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10);
    const formatted = formatDateTyping(t.value);
    if (formatted !== t.value) {
      t.value = formatted;
      t.setSelectionRange(formatted.length, formatted.length);
    }
    const vol = getVol(v);
    vol.tests[ti] = vol.tests[ti] || {};
    vol.tests[ti].date = formatted;
    saveVols();
  } else if (t.dataset.kind === 'cam-band') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field;
    const cam = getCam(c);
    cam.tests[ti] = cam.tests[ti] || {};
    cam.tests[ti][field] = t.value;
    saveCams();
    renderCamSummary();
    renderCamTestSummary();
    renderCategoryAverages();
    renderCharts();
  } else if (t.dataset.kind === 'cam-sub') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field, sub = t.dataset.sub;
    const cam = getCam(c);
    cam.tests[ti] = cam.tests[ti] || {};
    cam.tests[ti][field + sub] = t.value;
    const band = computeSubBand(cam.tests[ti], field);
    cam.tests[ti][field] = band !== null ? String(band) : '';
    saveCams();
    renderCamSummary();
    renderCamTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'cam-note') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10);
    const cam = getCam(c);
    cam.tests[ti] = cam.tests[ti] || {};
    cam.tests[ti].note = t.innerHTML;
    saveCams();
  } else if (t.dataset.kind === 'cam-date') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10);
    const cam = getCam(c);
    cam.tests[ti] = cam.tests[ti] || {};
    cam.tests[ti].date = isoToDdmmyyyy(t.value);
    saveCams();
    renderCamTests();
  } else if (t.dataset.kind === 'cam-date-text') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10);
    const formatted = formatDateTyping(t.value);
    if (formatted !== t.value) {
      t.value = formatted;
      t.setSelectionRange(formatted.length, formatted.length);
    }
    const cam = getCam(c);
    cam.tests[ti] = cam.tests[ti] || {};
    cam.tests[ti].date = formatted;
    saveCams();
  } else if (t.dataset.kind === 'raw') {
    const day = t.dataset.day, skill = t.dataset.field;
    const band = rawToBand(skill, t.value);
    entries[day] = entries[day] || {};
    entries[day][skill + 'Raw'] = t.value;
    entries[day][skill] = band !== null ? String(band) : '';
    save();
    renderStats();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'vol-raw') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10), skill = t.dataset.field;
    const band = rawToBand(skill, t.value);
    const vol = getVol(v);
    vol.tests[ti] = vol.tests[ti] || {};
    vol.tests[ti][skill + 'Raw'] = t.value;
    vol.tests[ti][skill] = band !== null ? String(band) : '';
    saveVols();
    renderVolSummary();
    renderVolTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'cam-raw') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10), skill = t.dataset.field;
    const band = rawToBand(skill, t.value);
    const cam = getCam(c);
    cam.tests[ti] = cam.tests[ti] || {};
    cam.tests[ti][skill + 'Raw'] = t.value;
    cam.tests[ti][skill] = band !== null ? String(band) : '';
    saveCams();
    renderCamSummary();
    renderCamTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'actual-band') {
    const c = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field;
    const actual = getActual(c);
    actual.tests[ti] = actual.tests[ti] || {};
    actual.tests[ti][field] = t.value;
    saveActuals();
    renderActualSummary();
    renderActualTestSummary();
    renderCategoryAverages();
    renderCharts();
  } else if (t.dataset.kind === 'actual-sub') {
    const c = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field, sub = t.dataset.sub;
    const actual = getActual(c);
    actual.tests[ti] = actual.tests[ti] || {};
    actual.tests[ti][field + sub] = t.value;
    const band = computeSubBand(actual.tests[ti], field);
    actual.tests[ti][field] = band !== null ? String(band) : '';
    saveActuals();
    renderActualSummary();
    renderActualTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'actual-note') {
    const c = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10);
    const actual = getActual(c);
    actual.tests[ti] = actual.tests[ti] || {};
    actual.tests[ti].note = t.innerHTML;
    saveActuals();
  } else if (t.dataset.kind === 'actual-date') {
    const c = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10);
    const actual = getActual(c);
    actual.tests[ti] = actual.tests[ti] || {};
    actual.tests[ti].date = isoToDdmmyyyy(t.value);
    saveActuals();
    renderActualTests();
  } else if (t.dataset.kind === 'actual-date-text') {
    const c = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10);
    const formatted = formatDateTyping(t.value);
    if (formatted !== t.value) {
      t.value = formatted;
      t.setSelectionRange(formatted.length, formatted.length);
    }
    const actual = getActual(c);
    actual.tests[ti] = actual.tests[ti] || {};
    actual.tests[ti].date = formatted;
    saveActuals();
  } else if (t.dataset.kind === 'actual-raw') {
    const c = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10), skill = t.dataset.field;
    const band = rawToBand(skill, t.value);
    const actual = getActual(c);
    actual.tests[ti] = actual.tests[ti] || {};
    actual.tests[ti][skill + 'Raw'] = t.value;
    actual.tests[ti][skill] = band !== null ? String(band) : '';
    saveActuals();
    renderActualSummary();
    renderActualTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'mock-band') {
    const c = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field;
    const mock = getMock(c);
    mock.tests[ti] = mock.tests[ti] || {};
    mock.tests[ti][field] = t.value;
    saveMocks();
    renderMockSummary();
    renderMockTestSummary();
    renderCategoryAverages();
    renderCharts();
  } else if (t.dataset.kind === 'mock-sub') {
    const c = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field, sub = t.dataset.sub;
    const mock = getMock(c);
    mock.tests[ti] = mock.tests[ti] || {};
    mock.tests[ti][field + sub] = t.value;
    const band = computeSubBand(mock.tests[ti], field);
    mock.tests[ti][field] = band !== null ? String(band) : '';
    saveMocks();
    renderMockSummary();
    renderMockTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'mock-note') {
    const c = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10);
    const mock = getMock(c);
    mock.tests[ti] = mock.tests[ti] || {};
    mock.tests[ti].note = t.innerHTML;
    saveMocks();
  } else if (t.dataset.kind === 'mock-date') {
    const c = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10);
    const mock = getMock(c);
    mock.tests[ti] = mock.tests[ti] || {};
    mock.tests[ti].date = isoToDdmmyyyy(t.value);
    saveMocks();
    renderMockTests();
  } else if (t.dataset.kind === 'mock-date-text') {
    const c = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10);
    const formatted = formatDateTyping(t.value);
    if (formatted !== t.value) {
      t.value = formatted;
      t.setSelectionRange(formatted.length, formatted.length);
    }
    const mock = getMock(c);
    mock.tests[ti] = mock.tests[ti] || {};
    mock.tests[ti].date = formatted;
    saveMocks();
  } else if (t.dataset.kind === 'mock-raw') {
    const c = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10), skill = t.dataset.field;
    const band = rawToBand(skill, t.value);
    const mock = getMock(c);
    mock.tests[ti] = mock.tests[ti] || {};
    mock.tests[ti][skill + 'Raw'] = t.value;
    mock.tests[ti][skill] = band !== null ? String(band) : '';
    saveMocks();
    renderMockSummary();
    renderMockTestSummary();
    renderCategoryAverages();
    renderCharts();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'practicec-band') {
    const c = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field;
    const pc = getPracticeC(c);
    pc.tests[ti] = pc.tests[ti] || {};
    pc.tests[ti][field] = t.value;
    savePracticeCs();
    renderPracticeCSummary();
    renderPracticeCTestSummary();
  } else if (t.dataset.kind === 'practicec-sub') {
    const c = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10), field = t.dataset.field, sub = t.dataset.sub;
    const pc = getPracticeC(c);
    pc.tests[ti] = pc.tests[ti] || {};
    pc.tests[ti][field + sub] = t.value;
    const band = computeSubBand(pc.tests[ti], field);
    pc.tests[ti][field] = band !== null ? String(band) : '';
    savePracticeCs();
    renderPracticeCSummary();
    renderPracticeCTestSummary();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  } else if (t.dataset.kind === 'practicec-note') {
    const c = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10);
    const pc = getPracticeC(c);
    pc.tests[ti] = pc.tests[ti] || {};
    pc.tests[ti].note = t.innerHTML;
    savePracticeCs();
  } else if (t.dataset.kind === 'practicec-date') {
    const c = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10);
    const pc = getPracticeC(c);
    pc.tests[ti] = pc.tests[ti] || {};
    pc.tests[ti].date = isoToDdmmyyyy(t.value);
    savePracticeCs();
    renderPracticeCTests();
  } else if (t.dataset.kind === 'practicec-date-text') {
    const c = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10);
    const formatted = formatDateTyping(t.value);
    if (formatted !== t.value) {
      t.value = formatted;
      t.setSelectionRange(formatted.length, formatted.length);
    }
    const pc = getPracticeC(c);
    pc.tests[ti] = pc.tests[ti] || {};
    pc.tests[ti].date = formatted;
    savePracticeCs();
  } else if (t.dataset.kind === 'practicec-raw') {
    const c = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10), skill = t.dataset.field;
    const band = rawToBand(skill, t.value);
    const pc = getPracticeC(c);
    pc.tests[ti] = pc.tests[ti] || {};
    pc.tests[ti][skill + 'Raw'] = t.value;
    pc.tests[ti][skill] = band !== null ? String(band) : '';
    savePracticeCs();
    renderPracticeCSummary();
    renderPracticeCTestSummary();
    const out = t.closest('.band-field').querySelector('.raw-band-out');
    if (out) out.textContent = 'Band: ' + (band !== null ? band.toFixed(1) : '—');
  }
});

document.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.dataset && t.dataset.kind === 'toggle') {
    const day = t.dataset.day;
    entries[day] = entries[day] || {};
    entries[day].completed = t.checked;
    save();
    renderAll();
  }
});

document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-action]');
  if (!t) return;
  if (t.dataset.action === 'open-date-picker') {
    const wrap = t.closest('.date-wrap');
    const native = wrap ? wrap.querySelector('.date-native') : null;
    if (native) {
      if (native.showPicker) { try { native.showPicker(); } catch (e) { native.focus(); native.click(); } }
      else { native.focus(); native.click(); }
    }
    return;
  }
  if (t.dataset.action === 'select-tab') {
    const tab = t.dataset.tab;
    mainTab = CATEGORY_TABS.indexOf(tab) !== -1 ? tab : parseInt(tab, 10);
    if (typeof mainTab === 'number') {
      activeWeek = mainTab;
      renderWeekSummary();
      renderDayList();
    }
    renderMainTabs();
  } else if (t.dataset.action === 'select-vol-number') {
    activeVol = parseInt(t.dataset.vol, 10);
    renderVolSection();
  } else if (t.dataset.action === 'select-cam-number') {
    activeCam = parseInt(t.dataset.cam, 10);
    renderCamSection();
  } else if (t.dataset.action === 'add-test') {
    const v = parseInt(t.dataset.vol, 10);
    const vol = getVol(v);
    vol.tests.push({});
    saveVols();
    renderVolSection();
  } else if (t.dataset.action === 'end-vol') {
    const v = parseInt(t.dataset.vol, 10);
    const vol = getVol(v);
    vol.completed = true;
    saveVols();
    renderVolSection();
  } else if (t.dataset.action === 'add-cam-test') {
    const c = parseInt(t.dataset.cam, 10);
    const cam = getCam(c);
    cam.tests.push({});
    saveCams();
    renderCamSection();
  } else if (t.dataset.action === 'end-cam') {
    const c = parseInt(t.dataset.cam, 10);
    const cam = getCam(c);
    cam.completed = true;
    saveCams();
    renderCamSection();
  } else if (t.dataset.action === 'delete-vol-test') {
    const v = parseInt(t.dataset.vol, 10), ti = parseInt(t.dataset.test, 10);
    const vol = getVol(v);
    vol.tests.splice(ti, 1);
    saveVols();
    renderVolSection();
  } else if (t.dataset.action === 'delete-cam-test') {
    const c = parseInt(t.dataset.cam, 10), ti = parseInt(t.dataset.test, 10);
    const cam = getCam(c);
    cam.tests.splice(ti, 1);
    saveCams();
    renderCamSection();
  } else if (t.dataset.action === 'select-actual-number') {
    activeActual = parseInt(t.dataset.actual, 10);
    renderActualSection();
  } else if (t.dataset.action === 'add-actual-test') {
    const a = parseInt(t.dataset.actual, 10);
    const actual = getActual(a);
    actual.tests.push({});
    saveActuals();
    renderActualSection();
  } else if (t.dataset.action === 'end-actual') {
    const a = parseInt(t.dataset.actual, 10);
    const actual = getActual(a);
    actual.completed = true;
    saveActuals();
    renderActualSection();
  } else if (t.dataset.action === 'delete-actual-test') {
    const a = parseInt(t.dataset.actual, 10), ti = parseInt(t.dataset.test, 10);
    const actual = getActual(a);
    actual.tests.splice(ti, 1);
    saveActuals();
    renderActualSection();
  } else if (t.dataset.action === 'select-mock-number') {
    activeMock = parseInt(t.dataset.mock, 10);
    renderMockSection();
  } else if (t.dataset.action === 'add-mock-test') {
    const m = parseInt(t.dataset.mock, 10);
    const mock = getMock(m);
    mock.tests.push({});
    saveMocks();
    renderMockSection();
  } else if (t.dataset.action === 'end-mock') {
    const m = parseInt(t.dataset.mock, 10);
    const mock = getMock(m);
    mock.completed = true;
    saveMocks();
    renderMockSection();
  } else if (t.dataset.action === 'delete-mock-test') {
    const m = parseInt(t.dataset.mock, 10), ti = parseInt(t.dataset.test, 10);
    const mock = getMock(m);
    mock.tests.splice(ti, 1);
    saveMocks();
    renderMockSection();
  } else if (t.dataset.action === 'select-practicec-number') {
    activePracticeC = parseInt(t.dataset.practicec, 10);
    renderPracticeCSection();
  } else if (t.dataset.action === 'add-practicec-test') {
    const p = parseInt(t.dataset.practicec, 10);
    const pc = getPracticeC(p);
    pc.tests.push({});
    savePracticeCs();
    renderPracticeCSection();
  } else if (t.dataset.action === 'end-practicec') {
    const p = parseInt(t.dataset.practicec, 10);
    const pc = getPracticeC(p);
    pc.completed = true;
    savePracticeCs();
    renderPracticeCSection();
  } else if (t.dataset.action === 'delete-practicec-test') {
    const p = parseInt(t.dataset.practicec, 10), ti = parseInt(t.dataset.test, 10);
    const pc = getPracticeC(p);
    pc.tests.splice(ti, 1);
    savePracticeCs();
    renderPracticeCSection();
  } else if (t.dataset.action === 'edit-day-desc') {
    const day = t.dataset.day;
    const wrap = t.closest('.day-desc-wrap');
    if (!wrap) return;
    const e = entries[day] || {};
    const planDay = PLAN.find((d) => String(d.day) === String(day));
    const content = e.desc !== undefined ? e.desc : (planDay ? planDay.desc : '');
    wrap.innerHTML = dayDescEditorHtml(day, content);
    const editable = wrap.querySelector('.day-desc-editable');
    if (editable) {
      editable.focus();
      const range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else if (t.dataset.action === 'save-day-desc') {
    const day = t.dataset.day;
    const wrap = t.closest('.day-desc-wrap');
    if (!wrap) return;
    const editable = wrap.querySelector('.day-desc-editable');
    const rawHtml = editable ? editable.innerHTML.trim() : '';
    const newContent = normalizeDayDescHtml(rawHtml);
    entries[day] = entries[day] || {};
    entries[day].desc = newContent;
    save();
    wrap.innerHTML = '<div class="day-desc" data-action="edit-day-desc" data-day="' + day + '">' + newContent + '</div>';
  } else if (t.dataset.action === 'scroll-to-test') {
    const target = document.getElementById(t.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.style.transition = 'box-shadow 0.3s';
      target.style.boxShadow = '0 0 0 3px var(--accent)';
      setTimeout(() => { target.style.boxShadow = '0 1px 3px rgba(22,35,61,.05)'; }, 900);
    }
  }
});

function insertBrAtCursor() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const br = document.createElement('br');
  range.insertNode(br);
  range.setStartAfter(br);
  range.setEndAfter(br);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

document.addEventListener('keydown', (ev) => {
  if (!ev.target.classList || !ev.target.classList.contains('day-desc-editable')) return;
  if (ev.key === 'Enter') {
    ev.preventDefault();
    insertBrAtCursor();
  }
});

document.addEventListener('beforeinput', (ev) => {
  if (!ev.target.classList || !ev.target.classList.contains('day-desc-editable')) return;
  if (ev.inputType === 'insertParagraph' || ev.inputType === 'insertLineBreak') {
    ev.preventDefault();
    insertBrAtCursor();
  }
});

document.addEventListener('keydown', (ev) => {
  if (!ev.target.classList || !ev.target.classList.contains('note-editable')) return;
  if (!(ev.ctrlKey || ev.metaKey)) return;
  const key = ev.key.toLowerCase();
  if (key === 'b') { ev.preventDefault(); document.execCommand('bold'); }
  else if (key === 'i') { ev.preventDefault(); document.execCommand('italic'); }
  else if (key === 'u') { ev.preventDefault(); document.execCommand('underline'); }
});

document.addEventListener('paste', (ev) => {
  if (!ev.target.classList || (!ev.target.classList.contains('note-editable') && !ev.target.classList.contains('day-desc-editable'))) return;
  ev.preventDefault();
  const text = (ev.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, text);
});

renderAll();

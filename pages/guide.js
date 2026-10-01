// 이용 안내: 비용·키·공유·계정 규칙을 사용자에게 설명 (규칙이 바뀌면 여기도 고친다)
export async function render(el) {
  el.innerHTML = `
    <h1>이용 안내</h1><br>
    <div class="card guide">
      <h2>🎬 무엇을 해 주나요</h2>
      <p>쇼츠 링크를 넣으면 영상을 장면(컷)마다 쪼개서 역할(도입·갈등·반전…), 카메라(샷 크기·앵글·무브·구도), 연출 지시,
         그 장면을 AI 영상 도구로 다시 만들 수 있는 <b>영어 생성 프롬프트</b>, 그리고 <b>왜 먹히는지</b>를 정리해 줍니다.
         영상 전체로는 이야기 구조와 “내 영상에 쓰려면” 체크리스트가 나옵니다.</p>
      <p class="muted">생성 프롬프트는 원작자가 쓴 게 아니라 영상을 보고 역설계한 추정이고, “왜 먹히나”는 AI 의 가설입니다. 영상이 쌓일수록 인사이트가 믿을 만해집니다.</p>
    </div>
    <div class="card guide">
      <h2>💳 비용은 누가 내나요</h2>
      <ul>
        <li>분석은 <b>분석을 요청한 사람의 키</b>로만 합니다. 다른 사람의 키는 절대 쓰지 않습니다.</li>
        <li>40초 영상 한 편에 factchat 약 <b>50크레딧</b>이 듭니다 (영상 길이·장면 수에 따라 달라짐).</li>
        <li><b>이미 누가 분석한 영상은 다시 분석하지 않으므로 무료</b>입니다. 결과는 모두가 같이 봅니다. 이미 분석된 링크를 넣으면 경고가 뜨고, 그래도 다시 분석을 고르면 내 키로 비용이 다시 들며 기존 결과를 덮어씁니다.</li>
        <li>조회수·채널 같은 YouTube 정보는 운영자의 무료 키로 받습니다 (사용자 비용 없음).</li>
      </ul>
    </div>
    <div class="card guide">
      <h2>🔐 내 키는 안전한가요</h2>
      <ul>
        <li>키는 서버에서 <b>암호화(AES-256)</b>해 보관하고, 분석하는 순간에만 서버 안에서 풀어 씁니다.</li>
        <li>브라우저·화면으로는 다시 내보내지 않습니다. 설정 화면에도 끝 4자리만 보입니다.</li>
        <li>설정에서 언제든 바꾸거나 삭제할 수 있습니다. 삭제하면 그 뒤로는 분석을 요청할 수 없습니다.</li>
      </ul>
      <p class="muted">키 발급: 고려대 factchat <a href="https://llm.korea.ac.kr/" target="_blank" rel="noopener">llm.korea.ac.kr ↗</a>
        (로그인 → 좌측 하단 API Gateway → API 키 생성) · Google Gemini <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">AI Studio ↗</a></p>
    </div>
    <div class="card guide">
      <h2>👤 계정</h2>
      <ul>
        <li>가입 신청 후 <b>관리자가 승인</b>하면 쓸 수 있습니다.</li>
        <li>메일을 보내지 않는 방식이라 <b>비밀번호 찾기 메일이 없습니다</b>. 잊어버렸으면 관리자에게 재설정을 요청하세요.</li>
        <li>비밀번호는 오른쪽 위 내 계정 → 설정에서 바꿀 수 있습니다.</li>
      </ul>
    </div>`;
  return 0;
}

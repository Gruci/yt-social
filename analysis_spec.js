// python run.py spec 이 만든다. 직접 고치지 않는다.
export default {
  "labels": {
    "hook_type": {
      "ending_first": "결말 먼저",
      "shock_scene": "충격 장면",
      "question": "질문 던지기",
      "instant_conflict": "바로 갈등",
      "absurd_visual": "황당 비주얼",
      "self_intro": "캐릭터·상황 소개",
      "other": "기타"
    },
    "text_type": {
      "none": "없음",
      "hook_caption": "자극 문구",
      "question": "질문 문구",
      "situation": "상황 설명",
      "dialogue_subtitle": "대사 자막",
      "other": "기타"
    },
    "dialogue_type": {
      "none": "없음",
      "scream": "비명·감탄",
      "question": "질문",
      "declaration": "선언·폭탄발언",
      "insult": "욕설·모욕",
      "conflict": "말다툼",
      "narration": "내레이션",
      "other": "기타"
    },
    "segment_flags": {
      "on_screen_text": "화면 텍스트",
      "dialogue": "대사",
      "close_up": "클로즈업",
      "surreal_element": "비현실 요소",
      "sound_effect": "효과음",
      "bgm": "배경음악"
    },
    "content_form": {
      "standalone": "단편 완결",
      "series_episode": "시리즈 회차",
      "compilation": "몰아보기·통합본",
      "teaser": "티저·예고",
      "highlight_clip": "본편 하이라이트 클립",
      "info_review": "정보·리뷰·강의",
      "other": "기타"
    },
    "genre": {
      "family_conflict": "시월드·고부·가족 갈등",
      "chaebol_identity": "재벌·숨은 신분",
      "revenge_justice": "복수·참교육",
      "romance": "로맨스",
      "fantasy_historical": "로판·궁중·무협·판타지",
      "school": "학교·일진",
      "workplace": "직장·갑질",
      "horror_thriller": "호러·스릴러",
      "comedy_sketch": "코미디·상황극",
      "daily_story": "일상·사연",
      "other": "기타"
    },
    "payoff_type": {
      "catharsis": "사이다·참교육",
      "identity_reveal": "신분·정체 반전",
      "comic_twist": "반전 개그",
      "emotional": "감동·여운",
      "romance_payoff": "로맨스 성취",
      "cliffhanger": "열린 결말·다음 화",
      "other": "기타"
    },
    "scene_role": {
      "hook": "도입(Hook)",
      "setup": "설정",
      "development": "전개",
      "conflict": "갈등",
      "escalation": "고조",
      "twist": "반전",
      "climax": "클라이맥스",
      "counterattack": "반격·참교육",
      "payoff": "결말·해소",
      "epilogue": "에필로그",
      "loop": "루프(처음으로 이어짐)",
      "title": "타이틀·브릿지",
      "outro": "엔드카드·예고",
      "other": "기타"
    },
    "device": {
      "instant_conflict": "즉시 갈등",
      "curiosity_gap": "호기심 유발",
      "cliffhanger": "궁금하게 끊기",
      "tension": "긴장 고조",
      "rage_bait": "분노 유발",
      "emotional_peak": "감정 폭발",
      "flutter": "심쿵·설렘",
      "cute": "귀여움",
      "lingering": "여운·감동",
      "catharsis": "사이다·참교육",
      "reveal": "정체·진실 공개",
      "twist": "반전",
      "fact_bomb": "팩트 폭격·논리 반박",
      "punchline": "펀치라인",
      "absurdity": "황당함",
      "exaggeration": "과장",
      "banter": "티키타카",
      "meme": "밈·패러디",
      "relatability": "현실 공감",
      "cliche": "클리셰 활용",
      "villain": "빌런 등장",
      "pattern_break": "예상 깨기",
      "contrast": "대비",
      "loop": "루프 연결",
      "other": "기타"
    },
    "shot_size": {
      "extreme_wide": "익스트림 와이드",
      "wide": "와이드(풀샷)",
      "medium_wide": "미디엄 와이드",
      "medium": "미디엄",
      "medium_close": "미디엄 클로즈업(바스트)",
      "close_up": "클로즈업",
      "extreme_close_up": "익스트림 클로즈업",
      "graphic": "그래픽·타이틀 카드"
    },
    "camera_angle": {
      "top_down": "탑다운 90°",
      "birds_eye": "버즈아이 65°",
      "high": "하이 앵글 45°",
      "above": "약간 위 30°",
      "slightly_above": "살짝 위 15°",
      "straight_on": "정면 아이레벨 0°",
      "hero": "히어로 뷰 -15°",
      "low": "로우 앵글 -45°",
      "worms_eye": "웜즈아이 -75°",
      "dutch": "더치 앵글 (기울임)"
    },
    "camera_direction": {
      "front": "정면",
      "three_quarter": "3/4 측면",
      "side": "측면",
      "back": "뒷모습"
    },
    "camera_move": {
      "static": "고정",
      "pan": "팬 (좌우 회전)",
      "tilt": "틸트 (상하 회전)",
      "zoom_in": "줌 인",
      "zoom_out": "줌 아웃",
      "roll": "롤 (기울이기)",
      "tracking_follow": "트래킹 (뒤따라가기)",
      "tracking_side": "트래킹 (옆으로 나란히)",
      "arc": "아크 (주위를 돌기)",
      "boom": "붐 (위아래 크레인)",
      "pedestal": "페데스탈 (카메라째 상하 이동)",
      "dolly_in": "달리 인 (다가가기)",
      "dolly_out": "달리 아웃 (물러나기)",
      "handheld": "핸드헬드 (흔들림)",
      "shake_effect": "충격 흔들림 효과",
      "ken_burns": "켄 번스 (정지 이미지 줌·팬)",
      "motion_graphic": "모션 그래픽"
    },
    "move_speed": {
      "none": "움직임 없음",
      "slow": "느림",
      "normal": "보통",
      "fast": "빠름"
    },
    "framing": {
      "single": "싱글",
      "two_shot": "투샷",
      "group": "그룹샷 (3인 이상)",
      "confrontation": "대치 (좌우 대립)",
      "over_the_shoulder": "오버더숄더",
      "pov": "POV (인물 시점)",
      "establishing": "설정샷 (장소 소개)",
      "insert": "인서트 (물건·손·화면)",
      "silhouette": "실루엣",
      "split_screen": "분할 화면"
    },
    "transition": {
      "hard_cut": "하드컷",
      "fade": "페이드",
      "dissolve": "디졸브",
      "flash": "플래시·화이트아웃",
      "graphic_wipe": "그래픽·와이프 전환"
    },
    "bgm_mood": {
      "none": "BGM 없음 (현장음·대사만)",
      "upbeat": "경쾌·코믹",
      "tension": "긴장·서스펜스",
      "sad": "감성·슬픔",
      "romantic": "로맨틱·설렘",
      "epic": "웅장·오케스트라",
      "ending_jingle": "엔딩 징글·시그니처",
      "other": "기타 분위기"
    },
    "sfx": {
      "impact": "타격·충돌",
      "heartbeat": "심장박동",
      "scream_shout": "비명·고함",
      "laugh": "웃음소리",
      "sigh_breath": "한숨·숨소리",
      "whoosh": "휙·전환음",
      "notification": "알림·전화·벨",
      "ambient": "환경음"
    },
    "caption_type": {
      "dialogue_subtitle": "대사 자막",
      "hook_text": "훅·제목 문구",
      "emphasis": "강조·효과 문구",
      "speech_bubble": "말풍선",
      "info": "정보 (시간·장소·인물명)",
      "channel_logo": "채널 로고·워터마크",
      "cta": "시청 유도 (구독·다음 화)"
    },
    "caption_pos": {
      "top": "상단",
      "center": "중앙",
      "bottom": "하단"
    },
    "screen_source": {
      "camera": "일반 영상 (실사·AI 생성)",
      "animation_2d": "2D 그림",
      "graphic": "그래픽·타이틀 카드",
      "phone_screen": "휴대폰·SNS·메신저 화면",
      "dashcam": "블랙박스",
      "cctv_homecam": "CCTV·홈캠"
    }
  },
  "groups": {
    "content_form": {
      "standalone": "단편",
      "series_episode": "연재",
      "compilation": "연재",
      "teaser": "홍보",
      "highlight_clip": "홍보",
      "info_review": "비드라마",
      "other": "기타"
    },
    "genre": {
      "family_conflict": "관계 갈등",
      "chaebol_identity": "신분·복수",
      "revenge_justice": "신분·복수",
      "romance": "로맨스·판타지",
      "fantasy_historical": "로맨스·판타지",
      "school": "생활 무대",
      "workplace": "생활 무대",
      "horror_thriller": "장르물",
      "comedy_sketch": "웃음",
      "daily_story": "생활 무대",
      "other": "기타"
    },
    "payoff_type": {
      "catharsis": "통쾌",
      "identity_reveal": "통쾌",
      "comic_twist": "웃음",
      "emotional": "감정",
      "romance_payoff": "감정",
      "cliffhanger": "미완결",
      "other": "기타"
    },
    "scene_role": {
      "hook": "도입",
      "setup": "도입",
      "development": "전개",
      "conflict": "전개",
      "escalation": "위기·절정",
      "twist": "위기·절정",
      "climax": "위기·절정",
      "counterattack": "결말",
      "payoff": "결말",
      "epilogue": "결말",
      "loop": "결말",
      "title": "구성 요소",
      "outro": "구성 요소",
      "other": "기타"
    },
    "device": {
      "instant_conflict": "훅·몰입",
      "curiosity_gap": "훅·몰입",
      "cliffhanger": "훅·몰입",
      "tension": "훅·몰입",
      "rage_bait": "감정 자극",
      "emotional_peak": "감정 자극",
      "flutter": "감정 자극",
      "cute": "감정 자극",
      "lingering": "감정 자극",
      "catharsis": "보상",
      "reveal": "보상",
      "twist": "보상",
      "fact_bomb": "보상",
      "punchline": "웃음",
      "absurdity": "웃음",
      "exaggeration": "웃음",
      "banter": "웃음",
      "meme": "웃음",
      "relatability": "공감·익숙함",
      "cliche": "공감·익숙함",
      "villain": "공감·익숙함",
      "pattern_break": "구조",
      "contrast": "구조",
      "loop": "구조",
      "other": "기타"
    },
    "shot_size": {
      "extreme_wide": "원경",
      "wide": "원경",
      "medium_wide": "중경",
      "medium": "중경",
      "medium_close": "근경",
      "close_up": "근경",
      "extreme_close_up": "근경",
      "graphic": "특수"
    },
    "camera_angle": {
      "top_down": "부감",
      "birds_eye": "부감",
      "high": "부감",
      "above": "부감",
      "slightly_above": "부감",
      "straight_on": "아이레벨",
      "hero": "앙각",
      "low": "앙각",
      "worms_eye": "앙각",
      "dutch": "특수"
    },
    "camera_direction": {
      "front": "정면",
      "three_quarter": "측면",
      "side": "측면",
      "back": "뒷모습"
    },
    "camera_move": {
      "static": "고정",
      "zoom_in": "줌",
      "zoom_out": "줌",
      "pan": "회전",
      "tilt": "회전",
      "roll": "회전",
      "tracking_follow": "이동",
      "tracking_side": "이동",
      "arc": "이동",
      "boom": "이동",
      "pedestal": "이동",
      "dolly_in": "이동",
      "dolly_out": "이동",
      "handheld": "흔들림",
      "shake_effect": "흔들림",
      "ken_burns": "편집·그래픽",
      "motion_graphic": "편집·그래픽"
    },
    "move_speed": {
      "none": "없음",
      "slow": "느림",
      "normal": "보통",
      "fast": "빠름"
    },
    "framing": {
      "single": "인원",
      "two_shot": "인원",
      "group": "인원",
      "confrontation": "관계",
      "over_the_shoulder": "관계",
      "pov": "관계",
      "establishing": "특수",
      "insert": "특수",
      "silhouette": "특수",
      "split_screen": "특수"
    },
    "transition": {
      "hard_cut": "컷",
      "fade": "효과 전환",
      "dissolve": "효과 전환",
      "flash": "효과 전환",
      "graphic_wipe": "효과 전환"
    },
    "bgm_mood": {
      "none": "없음",
      "upbeat": "밝음",
      "romantic": "밝음",
      "tension": "어두움",
      "sad": "어두움",
      "epic": "강조",
      "ending_jingle": "강조",
      "other": "기타"
    },
    "sfx": {
      "impact": "강조",
      "heartbeat": "긴장",
      "scream_shout": "감정",
      "laugh": "감정",
      "sigh_breath": "감정",
      "whoosh": "편집",
      "notification": "상황",
      "ambient": "상황"
    },
    "caption_type": {
      "dialogue_subtitle": "대사",
      "hook_text": "연출 문구",
      "emphasis": "연출 문구",
      "speech_bubble": "연출 문구",
      "info": "정보",
      "channel_logo": "채널",
      "cta": "채널"
    },
    "caption_pos": {
      "top": "상단",
      "center": "중앙",
      "bottom": "하단"
    },
    "screen_source": {
      "camera": "영상",
      "animation_2d": "그림",
      "graphic": "그래픽",
      "phone_screen": "화면 속 화면",
      "dashcam": "기록 영상",
      "cctv_homecam": "기록 영상"
    }
  },
  "chunk_sec": 60,
  "overview_fps": 1.0,
  "scene_fps": 3.0,
  "overview_prompt": "너는 유튜브 쇼츠가 왜 먹히는지 분석하는 숏폼 연출가다.\n이 영상 전체({duration}초)를 보고 개요를 작성하라.\n\n규칙\n- hook_type 과 hook_summary 는 처음 3초만 보고 판단하라.\n- video_summary 와 story_structure 는 영상 끝까지 보고 결말까지 적어라.\n- why_catchy 와 recreate_checklist 는 이 영상만의 구체적인 장치를 짚어라. \"재미있다\" 같은 일반론은 쓰지 마라.\n- 조회수·좋아요 같은 숫자는 쓰지 마라 (따로 저장된다).\n- 보이거나 들리는 것에 근거하라. 추측이면 uncertain_notes 에 적어라.",
  "scene_prompt": "너는 AI 숏폼 영상을 역설계하는 연출가다.\n이 영상의 {start}초부터 {end}초까지만 보고, 컷이 바뀔 때마다 새 장면으로 나눠 장면 목록을 만들어라.\n\n규칙\n- start_sec·end_sec 는 영상 처음 기준 절대 초다. 범위 경계에 걸친 장면은 이 범위 안의 부분만 적어라.\n- 모든 분류 항목은 정해진 선택지에서 가장 가까운 것을 골라라. 움직임이 없으면 camera_move=static, move_speed=none.\n- 정지 이미지를 천천히 확대·이동하면 ken_burns, 편집으로 넣은 흔들림은 shake_effect.\n- 효과음·화면 글자가 없으면 빈 목록. bgm_mood 는 음악이 없을 때만 none.\n- directing 은 촬영 현장에서 바로 쓸 수 있게 타이밍(몇 초에, 무엇이 끝나는 순간)과 이유까지 적어라.\n- generation_prompt 는 이 장면을 AI 영상 도구로 다시 만들 수 있을 만큼 구체적인 영어 프롬프트로 써라.\n- why_it_works 는 앞뒤 장면과의 관계(긴장을 올리는지, 궁금증을 남기는지, 보상을 주는지)로 설명하라.\n- 대사와 화면 텍스트는 원문 그대로 적어라.\n- {start}초 이전과 {end}초 이후 내용은 무시하라.",
  "overview_schema": {
    "description": "개요 호출의 출력.",
    "properties": {
      "first_dialogue_sec": {
        "anyOf": [
          {
            "type": "number"
          },
          {
            "type": "null"
          }
        ],
        "description": "첫 대사 시작 시점(초). 없으면 null",
        "title": "First Dialogue Sec"
      },
      "first_cut_sec": {
        "anyOf": [
          {
            "type": "number"
          },
          {
            "type": "null"
          }
        ],
        "description": "첫 컷 전환 시점(초). 없으면 null",
        "title": "First Cut Sec"
      },
      "hook_type": {
        "description": "처음 3초의 도입부 유형. ending_first=결말/클라이맥스 먼저, shock_scene=충격 장면, question=질문 던지기, instant_conflict=바로 갈등 대사, absurd_visual=황당한 비주얼, self_intro=캐릭터/상황 소개, other=기타",
        "enum": [
          "ending_first",
          "shock_scene",
          "question",
          "instant_conflict",
          "absurd_visual",
          "self_intro",
          "other"
        ],
        "title": "Hook Type",
        "type": "string"
      },
      "hook_summary": {
        "description": "처음 3초가 시청자를 붙잡는 장치를 한 문장으로 요약 (한국어)",
        "title": "Hook Summary",
        "type": "string"
      },
      "video_summary": {
        "description": "영상 전체 줄거리와 결말을 두세 문장으로 요약 (한국어)",
        "title": "Video Summary",
        "type": "string"
      },
      "story_structure": {
        "description": "이야기 구조를 초와 함께 한 줄로 (예: 0초 갈등 제시 → 12초 정체 암시 → 22초 반전 → 35초 황당한 결말) (한국어)",
        "title": "Story Structure",
        "type": "string"
      },
      "why_catchy": {
        "description": "이 영상이 끝까지 보게 만들고 공유·반복 시청을 부르는 이유에 대한 가설 두세 문장 (한국어)",
        "title": "Why Catchy",
        "type": "string"
      },
      "recreate_checklist": {
        "description": "이 구조를 내 영상에 쓰려면 지킬 것 3~5개, 각각 한 문장 (한국어)",
        "items": {
          "type": "string"
        },
        "title": "Recreate Checklist",
        "type": "array"
      },
      "keywords": {
        "description": "이 영상을 검색·분류하기 위한 태그 3~7개 (한국어 단어). 장르, 소재, 인물 관계, 감정, 연출 기법. 예: 막장, 시어머니, 돈봉투, 결별요구, 클로즈업",
        "items": {
          "type": "string"
        },
        "title": "Keywords",
        "type": "array"
      },
      "content_form": {
        "description": "콘텐츠 형태. standalone=단편 완결, series_episode=시리즈 회차, compilation=몰아보기·통합본, teaser=티저·예고, highlight_clip=본편 하이라이트 클립, info_review=정보·리뷰·강의, other=기타",
        "enum": [
          "standalone",
          "series_episode",
          "compilation",
          "teaser",
          "highlight_clip",
          "info_review",
          "other"
        ],
        "title": "Content Form",
        "type": "string"
      },
      "genres": {
        "description": "장르·소재 1~2개. family_conflict=시월드·고부·가족 갈등, chaebol_identity=재벌·숨은 신분, revenge_justice=복수·참교육, romance=로맨스, fantasy_historical=로판·궁중·무협·판타지, school=학교·일진, workplace=직장·갑질, horror_thriller=호러·스릴러, comedy_sketch=코미디·상황극, daily_story=일상·사연, other=기타",
        "items": {
          "enum": [
            "family_conflict",
            "chaebol_identity",
            "revenge_justice",
            "romance",
            "fantasy_historical",
            "school",
            "workplace",
            "horror_thriller",
            "comedy_sketch",
            "daily_story",
            "other"
          ],
          "type": "string"
        },
        "title": "Genres",
        "type": "array"
      },
      "payoff_type": {
        "description": "결말이 시청자에게 주는 보상. catharsis=사이다·참교육, identity_reveal=신분·정체 반전, comic_twist=반전 개그, emotional=감동·여운, romance_payoff=로맨스 성취, cliffhanger=열린 결말·다음 화, other=기타",
        "enum": [
          "catharsis",
          "identity_reveal",
          "comic_twist",
          "emotional",
          "romance_payoff",
          "cliffhanger",
          "other"
        ],
        "title": "Payoff Type",
        "type": "string"
      },
      "uncertain_notes": {
        "description": "판단이 불확실했던 항목과 이유. 없으면 빈 문자열",
        "title": "Uncertain Notes",
        "type": "string"
      }
    },
    "required": [
      "first_dialogue_sec",
      "first_cut_sec",
      "hook_type",
      "hook_summary",
      "video_summary",
      "story_structure",
      "why_catchy",
      "recreate_checklist",
      "keywords",
      "content_form",
      "genres",
      "payoff_type",
      "uncertain_notes"
    ],
    "title": "Overview",
    "type": "object"
  },
  "scene_schema": {
    "$defs": {
      "Scene": {
        "properties": {
          "start_sec": {
            "description": "장면 시작 초 (영상 처음 기준 절대 초, 소수 한 자리)",
            "title": "Start Sec",
            "type": "number"
          },
          "end_sec": {
            "description": "장면 끝 초 (다음 컷 직전)",
            "title": "End Sec",
            "type": "number"
          },
          "role": {
            "description": "이야기 안에서 이 장면의 역할. hook=도입(Hook), setup=설정, development=전개, conflict=갈등, escalation=고조, twist=반전, climax=클라이맥스, counterattack=반격·참교육, payoff=결말·해소, epilogue=에필로그, loop=루프(처음으로 이어짐), title=타이틀·브릿지, outro=엔드카드·예고, other=기타",
            "enum": [
              "hook",
              "setup",
              "development",
              "conflict",
              "escalation",
              "twist",
              "climax",
              "counterattack",
              "payoff",
              "epilogue",
              "loop",
              "title",
              "outro",
              "other"
            ],
            "title": "Role",
            "type": "string"
          },
          "description": {
            "description": "무슨 일이 일어나는지 한두 문장 (한국어)",
            "title": "Description",
            "type": "string"
          },
          "shot_size": {
            "description": "샷 크기. extreme_wide=익스트림 와이드/extreme wide shot, wide=와이드(풀샷)/wide shot / full shot, medium_wide=미디엄 와이드/medium wide shot, medium=미디엄/medium shot, medium_close=미디엄 클로즈업(바스트)/medium close-up, close_up=클로즈업/close-up, extreme_close_up=익스트림 클로즈업/extreme close-up, graphic=그래픽·타이틀 카드/graphic title card",
            "enum": [
              "extreme_wide",
              "wide",
              "medium_wide",
              "medium",
              "medium_close",
              "close_up",
              "extreme_close_up",
              "graphic"
            ],
            "title": "Shot Size",
            "type": "string"
          },
          "camera_angle": {
            "description": "카메라 높이·각도. top_down=탑다운 90°/top-down overhead shot (90°), birds_eye=버즈아이 65°/bird's-eye view (65°), high=하이 앵글 45°/high-angle shot (45°), above=약간 위 30°/above shot (30°), slightly_above=살짝 위 15°/slightly above eye level (15°), straight_on=정면 아이레벨 0°/straight-on eye-level shot, hero=히어로 뷰 -15°/hero view, slightly low angle (-15°), low=로우 앵글 -45°/low-angle shot (-45°), worms_eye=웜즈아이 -75°/worm's-eye view (-75°), dutch=더치 앵글 (기울임)/dutch angle",
            "enum": [
              "top_down",
              "birds_eye",
              "high",
              "above",
              "slightly_above",
              "straight_on",
              "hero",
              "low",
              "worms_eye",
              "dutch"
            ],
            "title": "Camera Angle",
            "type": "string"
          },
          "camera_move": {
            "description": "이 장면의 주된 카메라 움직임. static=고정/static locked-off camera, pan=팬 (좌우 회전)/pan, tilt=틸트 (상하 회전)/tilt, zoom_in=줌 인/zoom in, zoom_out=줌 아웃/zoom out, roll=롤 (기울이기)/camera roll / dutch tilt, tracking_follow=트래킹 (뒤따라가기)/tracking shot following the subject, tracking_side=트래킹 (옆으로 나란히)/lateral tracking shot alongside the subject, arc=아크 (주위를 돌기)/arc shot orbiting the subject, boom=붐 (위아래 크레인)/boom / crane shot, pedestal=페데스탈 (카메라째 상하 이동)/pedestal move, dolly_in=달리 인 (다가가기)/dolly in / push in, dolly_out=달리 아웃 (물러나기)/dolly out / pull out, handheld=핸드헬드 (흔들림)/handheld shaky camera, shake_effect=충격 흔들림 효과/camera shake impact effect, ken_burns=켄 번스 (정지 이미지 줌·팬)/Ken Burns slow zoom on a still image, motion_graphic=모션 그래픽/motion graphic animation",
            "enum": [
              "static",
              "pan",
              "tilt",
              "zoom_in",
              "zoom_out",
              "roll",
              "tracking_follow",
              "tracking_side",
              "arc",
              "boom",
              "pedestal",
              "dolly_in",
              "dolly_out",
              "handheld",
              "shake_effect",
              "ken_burns",
              "motion_graphic"
            ],
            "title": "Camera Move",
            "type": "string"
          },
          "framing": {
            "description": "구도. single=싱글/single shot, two_shot=투샷/two-shot, group=그룹샷 (3인 이상)/group shot, confrontation=대치 (좌우 대립)/confrontation two-shot, characters facing off, over_the_shoulder=오버더숄더/over-the-shoulder shot, pov=POV (인물 시점)/POV shot, establishing=설정샷 (장소 소개)/establishing shot, insert=인서트 (물건·손·화면)/insert shot, silhouette=실루엣/silhouette shot, split_screen=분할 화면/split screen",
            "enum": [
              "single",
              "two_shot",
              "group",
              "confrontation",
              "over_the_shoulder",
              "pov",
              "establishing",
              "insert",
              "silhouette",
              "split_screen"
            ],
            "title": "Framing",
            "type": "string"
          },
          "camera_direction": {
            "description": "주 피사체를 보는 방향. front=정면/front view, three_quarter=3/4 측면/three-quarter view, side=측면/side profile view, back=뒷모습/view from behind",
            "enum": [
              "front",
              "three_quarter",
              "side",
              "back"
            ],
            "title": "Camera Direction",
            "type": "string"
          },
          "move_speed": {
            "description": "카메라 움직임 속도. 고정이면 none. none=움직임 없음, slow=느림, normal=보통, fast=빠름",
            "enum": [
              "none",
              "slow",
              "normal",
              "fast"
            ],
            "title": "Move Speed",
            "type": "string"
          },
          "transition": {
            "description": "이 장면이 시작될 때의 전환. 대부분 hard_cut. hard_cut=하드컷, fade=페이드, dissolve=디졸브, flash=플래시·화이트아웃, graphic_wipe=그래픽·와이프 전환",
            "enum": [
              "hard_cut",
              "fade",
              "dissolve",
              "flash",
              "graphic_wipe"
            ],
            "title": "Transition",
            "type": "string"
          },
          "directing": {
            "description": "이 장면을 찍는 구체적인 연출 지시 한두 문장 (한국어): 카메라가 언제 어떻게 움직이는지, 컷 타이밍, 배우 동작·표정, 그렇게 하는 이유. 예: 대사가 끝나는 순간 0.5초 만에 푸시인해 놀란 표정을 강조, 컷은 반응 직후",
            "title": "Directing",
            "type": "string"
          },
          "characters": {
            "description": "등장인물과 외모·옷차림·표정 (한국어). 없으면 빈 문자열",
            "title": "Characters",
            "type": "string"
          },
          "setting": {
            "description": "장소·배경·조명·색감 (한국어)",
            "title": "Setting",
            "type": "string"
          },
          "dialogue": {
            "description": "들리는 대사 원문. 없으면 빈 문자열",
            "title": "Dialogue",
            "type": "string"
          },
          "on_screen_text": {
            "description": "화면 텍스트·자막 원문. 없으면 빈 문자열",
            "title": "On Screen Text",
            "type": "string"
          },
          "sound": {
            "description": "배경음악·효과음 (한국어). 없으면 빈 문자열",
            "title": "Sound",
            "type": "string"
          },
          "bgm_mood": {
            "description": "배경음악 분위기. 음악이 없으면 none. none=BGM 없음 (현장음·대사만), upbeat=경쾌·코믹, tension=긴장·서스펜스, sad=감성·슬픔, romantic=로맨틱·설렘, epic=웅장·오케스트라, ending_jingle=엔딩 징글·시그니처, other=기타 분위기",
            "enum": [
              "none",
              "upbeat",
              "tension",
              "sad",
              "romantic",
              "epic",
              "ending_jingle",
              "other"
            ],
            "title": "Bgm Mood",
            "type": "string"
          },
          "sfx": {
            "description": "들리는 효과음 0~3개. 없으면 빈 목록. impact=타격·충돌, heartbeat=심장박동, scream_shout=비명·고함, laugh=웃음소리, sigh_breath=한숨·숨소리, whoosh=휙·전환음, notification=알림·전화·벨, ambient=환경음",
            "items": {
              "enum": [
                "impact",
                "heartbeat",
                "scream_shout",
                "laugh",
                "sigh_breath",
                "whoosh",
                "notification",
                "ambient"
              ],
              "type": "string"
            },
            "title": "Sfx",
            "type": "array"
          },
          "narration": {
            "description": "화면 밖 내레이션·보이스오버가 있는가",
            "title": "Narration",
            "type": "boolean"
          },
          "caption_types": {
            "description": "화면 글자 유형 0~3개. 글자가 없으면 빈 목록. dialogue_subtitle=대사 자막, hook_text=훅·제목 문구, emphasis=강조·효과 문구, speech_bubble=말풍선, info=정보 (시간·장소·인물명), channel_logo=채널 로고·워터마크, cta=시청 유도 (구독·다음 화)",
            "items": {
              "enum": [
                "dialogue_subtitle",
                "hook_text",
                "emphasis",
                "speech_bubble",
                "info",
                "channel_logo",
                "cta"
              ],
              "type": "string"
            },
            "title": "Caption Types",
            "type": "array"
          },
          "caption_pos": {
            "description": "화면 글자 위치. 글자가 없으면 빈 목록. top=상단, center=중앙, bottom=하단",
            "items": {
              "enum": [
                "top",
                "center",
                "bottom"
              ],
              "type": "string"
            },
            "title": "Caption Pos",
            "type": "array"
          },
          "screen_source": {
            "description": "화면이 무엇으로 이루어졌나. camera=일반 영상 (실사·AI 생성), animation_2d=2D 그림, graphic=그래픽·타이틀 카드, phone_screen=휴대폰·SNS·메신저 화면, dashcam=블랙박스, cctv_homecam=CCTV·홈캠",
            "enum": [
              "camera",
              "animation_2d",
              "graphic",
              "phone_screen",
              "dashcam",
              "cctv_homecam"
            ],
            "title": "Screen Source",
            "type": "string"
          },
          "generation_prompt": {
            "description": "이 장면을 AI 영상 생성 도구(Veo·Sora·Kling·Runway 공통)로 다시 만들기 위한 영어 프롬프트. 순서: subject, action, setting, camera (shot size, angle, movement — 위에서 고른 값의 영어 용어 그대로), lighting & style, audio/dialogue cue. 실제 인물·브랜드 이름은 쓰지 말고 외형으로 묘사",
            "title": "Generation Prompt",
            "type": "string"
          },
          "why_it_works": {
            "description": "이 장면이 시청자를 붙잡거나 다음 장면을 보게 만드는 이유 한두 문장 (한국어)",
            "title": "Why It Works",
            "type": "string"
          },
          "devices": {
            "description": "이 장면에 쓰인 장치 1~3개. instant_conflict=즉시 갈등, curiosity_gap=호기심 유발, cliffhanger=궁금하게 끊기, tension=긴장 고조, rage_bait=분노 유발, emotional_peak=감정 폭발, flutter=심쿵·설렘, cute=귀여움, lingering=여운·감동, catharsis=사이다·참교육, reveal=정체·진실 공개, twist=반전, fact_bomb=팩트 폭격·논리 반박, punchline=펀치라인, absurdity=황당함, exaggeration=과장, banter=티키타카, meme=밈·패러디, relatability=현실 공감, cliche=클리셰 활용, villain=빌런 등장, pattern_break=예상 깨기, contrast=대비, loop=루프 연결, other=기타",
            "items": {
              "enum": [
                "instant_conflict",
                "curiosity_gap",
                "cliffhanger",
                "tension",
                "rage_bait",
                "emotional_peak",
                "flutter",
                "cute",
                "lingering",
                "catharsis",
                "reveal",
                "twist",
                "fact_bomb",
                "punchline",
                "absurdity",
                "exaggeration",
                "banter",
                "meme",
                "relatability",
                "cliche",
                "villain",
                "pattern_break",
                "contrast",
                "loop",
                "other"
              ],
              "type": "string"
            },
            "title": "Devices",
            "type": "array"
          }
        },
        "required": [
          "start_sec",
          "end_sec",
          "role",
          "description",
          "shot_size",
          "camera_angle",
          "camera_move",
          "framing",
          "camera_direction",
          "move_speed",
          "transition",
          "directing",
          "characters",
          "setting",
          "dialogue",
          "on_screen_text",
          "sound",
          "bgm_mood",
          "sfx",
          "narration",
          "caption_types",
          "caption_pos",
          "screen_source",
          "generation_prompt",
          "why_it_works",
          "devices"
        ],
        "title": "Scene",
        "type": "object"
      }
    },
    "description": "장면 호출의 출력.",
    "properties": {
      "scenes": {
        "description": "지정한 범위 안의 장면을 시간순으로. 컷이 바뀌면 새 장면",
        "items": {
          "$ref": "#/$defs/Scene"
        },
        "title": "Scenes",
        "type": "array"
      },
      "uncertain_notes": {
        "description": "판단이 불확실했던 항목과 이유. 없으면 빈 문자열",
        "title": "Uncertain Notes",
        "type": "string"
      }
    },
    "required": [
      "scenes",
      "uncertain_notes"
    ],
    "title": "SceneChunk",
    "type": "object"
  },
  "gemini": {
    "default_model": "gemini-3.8-flash",
    "factchat_model": "gemini-3.8-flash",
    "retry": {
      "attempts": 2,
      "backoff_sec": 30,
      "edge_max_wait_sec": 15,
      "retry_status": [
        429,
        503
      ],
      "retry_markers": [
        "429",
        "503",
        "RESOURCE_EXHAUSTED",
        "service_unavailable",
        "UNAVAILABLE",
        "high demand"
      ],
      "no_retry_markers": [
        "per day"
      ]
    }
  }
}

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
    "scene_role": {
      "hook": "도입(Hook)",
      "setup": "설정",
      "conflict": "갈등",
      "escalation": "고조",
      "twist": "반전",
      "climax": "클라이맥스",
      "payoff": "결말·해소",
      "loop": "루프(처음으로 이어짐)",
      "other": "기타"
    },
    "device": {
      "instant_conflict": "즉시 갈등",
      "curiosity_gap": "호기심 유발",
      "cliche": "클리셰 활용",
      "pattern_break": "예상 깨기",
      "twist": "반전",
      "reveal": "정체·진실 공개",
      "exaggeration": "과장",
      "absurdity": "황당함",
      "contrast": "대비",
      "relatability": "공감",
      "emotional_peak": "감정 폭발",
      "punchline": "펀치라인",
      "cliffhanger": "궁금하게 끊기",
      "loop": "루프 연결",
      "meme": "밈·패러디",
      "other": "기타"
    },
    "shot_size": {
      "extreme_wide": "익스트림 와이드",
      "wide": "와이드(풀샷)",
      "medium_wide": "미디엄 와이드",
      "medium": "미디엄",
      "medium_close": "미디엄 클로즈업",
      "close_up": "클로즈업",
      "extreme_close_up": "익스트림 클로즈업"
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
      "worms_eye": "웜즈아이 -75°"
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
      "handheld": "핸드헬드 (흔들림)"
    },
    "framing": {
      "single": "싱글",
      "two_shot": "투샷",
      "group": "그룹샷",
      "over_the_shoulder": "오버더숄더",
      "pov": "POV (인물 시점)",
      "establishing": "설정샷 (장소 소개)",
      "insert": "인서트 (물건·손 등)"
    }
  },
  "chunk_sec": 60,
  "overview_fps": 1.0,
  "scene_fps": 3.0,
  "overview_prompt": "너는 유튜브 쇼츠가 왜 먹히는지 분석하는 숏폼 연출가다.\n이 영상 전체({duration}초)를 보고 개요를 작성하라.\n\n규칙\n- hook_type 과 hook_summary 는 처음 3초만 보고 판단하라.\n- video_summary 와 story_structure 는 영상 끝까지 보고 결말까지 적어라.\n- why_catchy 와 recreate_checklist 는 이 영상만의 구체적인 장치를 짚어라. \"재미있다\" 같은 일반론은 쓰지 마라.\n- 보이거나 들리는 것에 근거하라. 추측이면 uncertain_notes 에 적어라.",
  "scene_prompt": "너는 AI 숏폼 영상을 역설계하는 연출가다.\n이 영상의 {start}초부터 {end}초까지만 보고, 컷이 바뀔 때마다 새 장면으로 나눠 장면 목록을 만들어라.\n\n규칙\n- start_sec·end_sec 는 영상 처음 기준 절대 초다. 범위 경계에 걸친 장면은 이 범위 안의 부분만 적어라.\n- 샷 크기·앵글·무브·구도는 정해진 선택지에서 가장 가까운 것을 골라라. 움직임이 없으면 static.\n- directing 은 촬영 현장에서 바로 쓸 수 있게 타이밍(몇 초에, 무엇이 끝나는 순간)과 이유까지 적어라.\n- generation_prompt 는 이 장면을 AI 영상 도구로 다시 만들 수 있을 만큼 구체적인 영어 프롬프트로 써라.\n- why_it_works 는 앞뒤 장면과의 관계(긴장을 올리는지, 궁금증을 남기는지, 보상을 주는지)로 설명하라.\n- 대사와 화면 텍스트는 원문 그대로 적어라.\n- {start}초 이전과 {end}초 이후 내용은 무시하라.",
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
            "description": "이야기 안에서 이 장면의 역할. hook=도입(Hook), setup=설정, conflict=갈등, escalation=고조, twist=반전, climax=클라이맥스, payoff=결말·해소, loop=루프(처음으로 이어짐), other=기타",
            "enum": [
              "hook",
              "setup",
              "conflict",
              "escalation",
              "twist",
              "climax",
              "payoff",
              "loop",
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
            "description": "샷 크기. extreme_wide=익스트림 와이드/extreme wide shot, wide=와이드(풀샷)/wide shot / full shot, medium_wide=미디엄 와이드/medium wide shot, medium=미디엄/medium shot, medium_close=미디엄 클로즈업/medium close-up, close_up=클로즈업/close-up, extreme_close_up=익스트림 클로즈업/extreme close-up",
            "enum": [
              "extreme_wide",
              "wide",
              "medium_wide",
              "medium",
              "medium_close",
              "close_up",
              "extreme_close_up"
            ],
            "title": "Shot Size",
            "type": "string"
          },
          "camera_angle": {
            "description": "카메라 높이·각도. top_down=탑다운 90°/top-down overhead shot (90°), birds_eye=버즈아이 65°/bird's-eye view (65°), high=하이 앵글 45°/high-angle shot (45°), above=약간 위 30°/above shot (30°), slightly_above=살짝 위 15°/slightly above eye level (15°), straight_on=정면 아이레벨 0°/straight-on eye-level shot, hero=히어로 뷰 -15°/hero view, slightly low angle (-15°), low=로우 앵글 -45°/low-angle shot (-45°), worms_eye=웜즈아이 -75°/worm's-eye view (-75°)",
            "enum": [
              "top_down",
              "birds_eye",
              "high",
              "above",
              "slightly_above",
              "straight_on",
              "hero",
              "low",
              "worms_eye"
            ],
            "title": "Camera Angle",
            "type": "string"
          },
          "camera_move": {
            "description": "이 장면의 주된 카메라 움직임. static=고정/static locked-off camera, pan=팬 (좌우 회전)/pan, tilt=틸트 (상하 회전)/tilt, zoom_in=줌 인/zoom in, zoom_out=줌 아웃/zoom out, roll=롤 (기울이기)/camera roll / dutch tilt, tracking_follow=트래킹 (뒤따라가기)/tracking shot following the subject, tracking_side=트래킹 (옆으로 나란히)/lateral tracking shot alongside the subject, arc=아크 (주위를 돌기)/arc shot orbiting the subject, boom=붐 (위아래 크레인)/boom / crane shot, pedestal=페데스탈 (카메라째 상하 이동)/pedestal move, dolly_in=달리 인 (다가가기)/dolly in / push in, dolly_out=달리 아웃 (물러나기)/dolly out / pull out, handheld=핸드헬드 (흔들림)/handheld shaky camera",
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
              "handheld"
            ],
            "title": "Camera Move",
            "type": "string"
          },
          "framing": {
            "description": "구도. single=싱글/single shot, two_shot=투샷/two-shot, group=그룹샷/group shot, over_the_shoulder=오버더숄더/over-the-shoulder shot, pov=POV (인물 시점)/POV shot, establishing=설정샷 (장소 소개)/establishing shot, insert=인서트 (물건·손 등)/insert shot",
            "enum": [
              "single",
              "two_shot",
              "group",
              "over_the_shoulder",
              "pov",
              "establishing",
              "insert"
            ],
            "title": "Framing",
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
            "description": "이 장면에 쓰인 장치 1~3개. instant_conflict=즉시 갈등, curiosity_gap=호기심 유발, cliche=클리셰 활용, pattern_break=예상 깨기, twist=반전, reveal=정체·진실 공개, exaggeration=과장, absurdity=황당함, contrast=대비, relatability=공감, emotional_peak=감정 폭발, punchline=펀치라인, cliffhanger=궁금하게 끊기, loop=루프 연결, meme=밈·패러디, other=기타",
            "items": {
              "enum": [
                "instant_conflict",
                "curiosity_gap",
                "cliche",
                "pattern_break",
                "twist",
                "reveal",
                "exaggeration",
                "absurdity",
                "contrast",
                "relatability",
                "emotional_peak",
                "punchline",
                "cliffhanger",
                "loop",
                "meme",
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
          "directing",
          "characters",
          "setting",
          "dialogue",
          "on_screen_text",
          "sound",
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

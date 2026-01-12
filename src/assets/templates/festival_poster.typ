#set page(
  width: 600pt,
  height: 900pt,
  margin: 0pt,
  fill: rgb("#0a0a0a")
)

// --- DATA LOGIC ---
#let default_data = (
  days: (
    (
      name: "FRIDAY",
      date: "JAN 23",
      headliner: "THOM YORKE",
      main_stage: ("Kaytranada", "PinkPantheress", "Disclosure"),
      discovery: ("The Marías", "L'Impératrice", "Yves Tumor")
    ),
    (
      name: "SATURDAY",
      date: "JAN 24",
      headliner: "TYLER, THE CREATOR",
      main_stage: ("Justice", "Slowdive", "Jamie xx"),
      discovery: ("Bakar", "Genesis Owusu", "Mount Kimbie")
    ),
    (
      name: "SUNDAY",
      date: "JAN 25",
      headliner: "ETHEL CAIN",
      main_stage: ("Jungle", "Four Tet", "Toro y Moi"),
      discovery: ("Choker", "Dijon", "Jean Dawson")
    )
  )
)

#let festival_data = if "data_path" in sys.inputs {
  json(sys.inputs.data_path)
} else {
  default_data
}

// --- DESIGN SYSTEM ---
#let spotify_green = rgb("#1DB954")
#let dark_grey = rgb("#121212")
#let card_bg = rgb("#181818")
#set text(font: ("Arial", "Source Sans 3", "sans-serif"), fill: white, fallback: true)

// 1. Background Visuals
// Radial glow behind headliners
#place(center + top)[
  #v(200pt)
  #circle(radius: 250pt, fill: gradient.radial(spotify_green.transparentize(90%), dark_grey.transparentize(100%), focal-center: (50%, 50%)))
]

// Subtle noise/grid pattern (optional but premium)
#place(center + top)[
  #rect(width: 100%, height: 100%, stroke: 0.1pt + white.transparentize(95%))
]

#pad(x: 45pt, y: 50pt)[
  // 2. Header & Branding
  #grid(
    columns: (1fr, auto),
    align: (left + horizon, right + horizon),
    [
      #set text(tracking: 8pt, weight: 800)
      #text(size: 14pt, fill: spotify_green)[THE SONIC ARCHIVE PRESENTS]
      #v(-8pt)
      #rotate(-2deg)[
        #text(size: 42pt, weight: 900, tracking: -1pt, fill: gradient.linear(white, spotify_green, angle: 45deg))[SOCIAL#h(4pt)WEEKEND]
      ]
    ],
    [
      #image("../images/genrescope.svg", width: 80pt)
    ]
  )

  #v(40pt)

  // 3. 3-Day Lineup
  #grid(
    columns: (1fr, 1fr, 1fr),
    column-gutter: 20pt,
    ..festival_data.days.map(day => [
      #align(center)[
        #block(
          fill: card_bg,
          width: 100%,
          radius: 6pt,
          inset: 12pt,
          stroke: 0.5pt + white.transparentize(90%)
        )[
          #set text(size: 10pt, weight: 800, fill: spotify_green)
          #upper(day.name)
          #v(-4pt)
          #text(size: 8pt, fill: luma(150))[#day.date]
        ]
        
        #v(15pt)
        
        // Headliner
        #text(size: 24pt, weight: 900, fill: white)[#upper(day.headliner)]
        
        #v(10pt)
        #line(length: 40%, stroke: 1.5pt + spotify_green)
        #v(10pt)
        
        // Main Stage
        #stack(
          spacing: 8pt,
          ..day.main_stage.map(artist => {
            text(size: 13pt, weight: 700, fill: luma(220))[#artist]
          })
        )
        
        #v(15pt)
        
        // Discovery
        #stack(
          spacing: 6pt,
          ..day.discovery.map(artist => {
            text(size: 9pt, weight: 500, fill: luma(160))[#artist]
          })
        )
      ]
    ])
  )

  #v(60pt)

  // 4. Visual Flourish
  #align(center)[
    #for i in range(5) {
      place(
        line(length: 100%, stroke: (0.5pt + spotify_green.transparentize(i * 15%)))
      )
      v(2pt)
    }
  ]

  // 5. Footer
  #align(bottom + center)[
    #grid(
      columns: (auto, auto),
      column-gutter: 12pt,
      align: horizon,
      [
        #text(size: 9pt, tracking: 2pt, fill: luma(120))[POWERED BY]
      ],
      [
        #image("../images/Primary_Logo_Green_CMYK.svg", width: 70pt)
      ]
    )
    #v(10pt)
    #text(size: 7pt, fill: luma(80), tracking: 1pt)[GENERATED VIA GENRESCOPE API • 2026 EDITION]
  ]
]

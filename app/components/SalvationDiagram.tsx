'use client'
import { useState } from "react";

const DARK_BLUE = "#1F3864";
const MID_BLUE = "#2E5496";
const LIGHT_BLUE = "#D6E4F7";
const GOLD = "#7F6000";
const LIGHT_GOLD = "#FFF2CC";
const GREEN = "#1E5631";
const LIGHT_GREEN = "#D9EAD3";
const GRAY = "#595959";
const PURPLE = "#4A235A";
const LIGHT_PURPLE = "#E8D5F5";

const explainers: Record<string, string> = {
  "Genesis 3:6-7": "Eve saw the forbidden tree and ate. Adam followed. In that moment sin entered God's creation for the first time. Their eyes were opened to shame — the immediate consequence of disobedience.",
  "Genesis 3:17-19": "God pronounces the curse on Adam. Because he disobeyed, toil, sorrow and death become the lot of all mankind. Dust thou art and unto dust thou shalt return — death is now the end of every human life.",
  "Genesis 3:23-24": "God drives Adam and Eve out of the garden. Cherubim and a flaming sword are placed to guard the way back to the tree of life. Every person born after this moment is born outside the garden — separated from God and from life.",
  "Psalm 51:5": "David confessing that the sinful condition is not something he acquired through bad choices. He was shapen in iniquity from conception. Every human being enters the world already in this condition.",
  "Isaiah 59:2": "The prophet declaring what sin does to the relationship between man and God. Iniquity separates. God's face is hidden. Prayer goes unanswered. This is the condition sin produces.",
  "Romans 5:12": "Paul tracing the origin of sin and death directly back to Adam. One man's disobedience brought sin into the world. Death followed sin. And death passed upon all men because all have sinned.",
  "Romans 3:23": "Paul's universal statement. All have sinned. Every person without exception falls short of God's glory. No one is exempt from this condition.",
  "Ephesians 2:1": "Paul describing the condition of believers before salvation. Dead in trespasses and sins. Not sick or weak — dead. That is the spiritual condition sin produces.",
  "Romans 6:23": "The wages — what sin earns — is death. But the gift of God is eternal life through Jesus Christ. This verse sets up the entire need for salvation.",
  "Romans 5:1": "The result of justification. Being declared righteous by faith produces peace with God. The hostility and separation caused by sin is resolved.",
  "Romans 3:28": "Paul's direct statement that a man is justified by faith without the deeds of the law. The works of the law — the animal sacrifice system — cannot produce justification.",
  "Galatians 2:16": "Paul stating clearly that no one is justified by the works of the law. Justification comes through faith in Jesus Christ alone.",
  "Ephesians 2:8-9": "Grace through faith is the means of salvation. It is not of yourselves — it is God's gift. Not of works — so no one can boast of earning it.",
  "1 John 2:3-4": "John drawing a direct line between keeping the commandments and genuinely knowing God. A person who claims to know God but does not keep His commandments is a liar. Obedience is the evidence of genuine relationship.",
  "James 2:17-18": "Faith without works is dead. James pressing the point that genuine faith must produce visible obedience. Show me your faith without works — it cannot be shown. Faith is evidenced by what it produces.",
  "James 2:17": "A single statement that cannot be softened. Faith without works is dead. Not weak or incomplete — dead. Genuine faith always produces fruit.",
  "James 2:24": "James stating plainly that a man is justified by works and not by faith only. Works are the evidence that vindicates faith as genuine before God.",
  "Romans 2:13": "Paul making clear that hearing the law is not enough. The doers of the law — those who actually obey — shall be justified. Obedience matters for justification.",
  "Hebrews 10:26-27": "A serious warning. If someone wilfully continues to sin after receiving the truth, no more sacrifice remains for their sins. Only a fearful expectation of judgment. Christ's sacrifice is not a license for continued wilful disobedience.",
  "Hebrews 10:4": "The definitive statement on why the animal sacrifice system could never be the final answer. No matter how many animals were offered, they could not remove sin. The system was always pointing forward to the one sacrifice that could.",
  "John 14:15": "Jesus defining what love for Him looks like in practice. Not a feeling. Not an emotion. Keeping His commandments. Love and obedience are the same thing in Jesus' own words.",
  "1 John 5:3": "John defining the love of God precisely. It is keeping His commandments. Not a vague principle of affection but concrete obedience to what God commanded.",
  "Matthew 16:27": "Jesus himself stating that when He returns every man will be rewarded according to his works. This is not human perception — this is Christ at the final judgment.",
  "Revelation 20:12": "The final judgment. The books are opened. The dead are judged according to their works. This is God evaluating every life — not men perceiving each other.",
  "Philippians 2:12": "Paul calling believers to actively work out their own salvation with fear and trembling. Salvation is not passive. It involves individual active responsibility and serious posture before God.",
  "2 Corinthians 7:1": "Paul calling believers to actively cleanse themselves from filthiness of both flesh and spirit. Both dimensions — inward and outward — require active pursuit of holiness. This is the ongoing work of sanctification.",
  "1 Corinthians 15:51-52": "Paul revealing the mystery of the resurrection. Not everyone will die but all will be changed — transformed from flesh and blood to incorruptible spirit bodies at the last trumpet.",
  "Revelation 21:1-3": "The ultimate destination. New Jerusalem comes DOWN from heaven to a new earth. God dwells WITH men on the restored earth. The final state is not men going up to heaven — it is God coming down to dwell with His people forever.",
  "Romans 8:30": "Paul tracing the full chain of salvation from predestination to glorification. Those God called He justified. Those He justified He glorified. Glorification is the certain end for those genuinely in Christ.",
  "Zechariah 14:4,9": "The prophet describing Christ's return. His feet stand on the Mount of Olives. He reigns as King over all the earth. The kingdom is physical and earthly — not a distant heaven.",
  "Galatians 3:19": "Paul explaining why the law of animal sacrifice was given. It was added because of transgressions — Israel's sin with the golden calf. It was temporary, pointing forward until the seed — Christ — came.",
  "Jeremiah 7:22": "God himself stating that He did not command burnt offerings and sacrifices when He brought Israel out of Egypt. What He commanded was obedience. The sacrificial system came later as an addition.",
};

const scriptures: Record<string, string> = {
  "Romans 3:23": "(23) For all have sinned, and come short of the glory of God.",
  "Ephesians 2:1": "(1) And you hath he quickened, who were dead in trespasses and sins.",
  "Romans 6:23": "(23) For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
  "Romans 5:1": "(1) Therefore being justified by faith, we have peace with God through our Lord Jesus Christ.",
  "Romans 3:28": "(28) Therefore we conclude that a man is justified by faith without the deeds of the law.",
  "Galatians 2:16": "(16) Knowing that a man is not justified by the works of the law, but by the faith of Jesus Christ, even we have believed in Jesus Christ, that we might be justified by the faith of Christ, and not by the works of the law: for by the works of the law shall no flesh be justified.",
  "Ephesians 2:8-9": "(8) For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: (9) Not of works, lest any man should boast.",
  "1 John 2:3-4": "(3) And hereby we do know that we know him, if we keep his commandments. (4) He that saith, I know him, and keepeth not his commandments, is a liar, and the truth is not in him.",
  "James 2:17-18": "(17) Even so faith, if it hath not works, is dead, being alone. (18) Yea, a man may say, Thou hast faith, and I have works: shew me thy faith without thy works, and I will shew thee my faith by my works.",
  "James 2:17": "(17) Even so faith, if it hath not works, is dead, being alone.",
  "James 2:24": "(24) Ye see then how that by works a man is justified, and not by faith only.",
  "Hebrews 10:4": "(4) For it is not possible that the blood of bulls and of goats should take away sins.",
  "Hebrews 10:26-27": "(26) For if we sin wilfully after that we have received the knowledge of the truth, there remaineth no more sacrifice for sins, (27) But a certain fearful looking for of judgment and fiery indignation, which shall devour the adversaries.",
  "John 14:15": "(15) If ye love me, keep my commandments.",
  "1 John 5:3": "(3) For this is the love of God, that we keep his commandments: and his commandments are not grievous.",
  "Matthew 16:27": "(27) For the Son of man shall come in the glory of his Father with his angels; and then he shall reward every man according to his works.",
  "Revelation 20:12": "(12) And I saw the dead, small and great, stand before God; and the books were opened: and another book was opened, which is the book of life: and the dead were judged out of those things which were written in the books, according to their works.",
  "1 Corinthians 15:51-52": "(51) Behold, I shew you a mystery; We shall not all sleep, but we shall all be changed, (52) In a moment, in the twinkling of an eye, at the last trump: for the trumpet shall sound, and the dead shall be raised incorruptible, and we shall be changed.",
  "Revelation 21:1-3": "(1) And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea. (2) And I John saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband. (3) And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.",
  "Romans 8:30": "(30) Moreover whom he did predestinate, them he also called: and whom he called, them he also justified: and whom he justified, them he also glorified.",
  "Zechariah 14:4,9": "(4) And his feet shall stand in that day upon the mount of Olives, which is before Jerusalem on the east... (9) And the LORD shall be king over all the earth: in that day shall there be one LORD, and his name one.",
  "Romans 2:13": "(13) For not the hearers of the law are just before God, but the doers of the law shall be justified.",
  "2 Corinthians 7:1": "(1) Having therefore these promises, dearly beloved, let us cleanse ourselves from all filthiness of the flesh and spirit, perfecting holiness in the fear of God.",
  "Philippians 2:12": "(12) Wherefore, my beloved, as ye have always obeyed, not as in my presence only, but now much more in my absence, work out your own salvation with fear and trembling.",
  "Genesis 3:6-7": "(6) And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat. (7) And their eyes were opened, and they knew that they were naked; and they sewed fig leaves together, and made themselves aprons.",
  "Genesis 3:23-24": "(23) Therefore the LORD God sent him forth from the garden of Eden, to till the ground from whence he was taken. (24) So he drove out the man; and he placed at the east of the garden of Eden Cherubims, and a flaming sword which turned every way, to keep the way of the tree of life.",
  "Genesis 3:17-19": "(17) And unto Adam he said, Because thou hast hearkened unto the voice of thy wife, and hast eaten of the tree, of which I commanded thee, saying, Thou shalt not eat of it: cursed is the ground for thy sake; in sorrow shalt thou eat of it all the days of thy life. (19) In the sweat of thy face shalt thou eat bread, till thou return unto the ground; for out of it wast thou taken: for dust thou art, and unto dust shalt thou return.",
  "Psalm 51:5": "(5) Behold, I was shapen in iniquity; and in sin did my mother conceive me.",
  "Isaiah 59:2": "(2) But your iniquities have separated between you and your God, and your sins have hid his face from you, that he will not hear.",
  "Romans 5:12": "(12) Wherefore, as by one man sin entered into the world, and death by sin; and so death passed upon all men, for that all have sinned.",
  "Galatians 3:19": "(19) Wherefore then serveth the law? It was added because of transgressions, till the seed should come to whom the promise was made; and it was ordained by angels in the hand of a mediator.",
  "Jeremiah 7:22": "(22) For I spake not unto your fathers, nor commanded them in the day that I brought them out of the land of Egypt, concerning burnt offerings or sacrifices.",
};

const stages = [
  {
    id: "pre",
    label: "Before Salvation",
    color: "#8B0000",
    lightColor: "#FFE5E5",
    icon: "✕",
    sublabel: null,
    description: "When Adam and Eve disobeyed God in the garden, sin entered the world and death followed. Every person born after them enters the world already in this condition — separated from God, under condemnation, with no way back through their own effort or merit. This is not something acquired later in life. It is the condition every human being is born into.",
    verses: ["Genesis 3:6-7", "Genesis 3:17-19", "Genesis 3:23-24", "Psalm 51:5", "Isaiah 59:2", "Romans 5:12", "Romans 3:23", "Ephesians 2:1", "Romans 6:23"],
    keywords: ["Dead in sin", "Separated from God", "Under condemnation", "Born into this condition", "No way back by own effort"]
  },
  {
    id: "justification",
    label: "Justification",
    sublabel: "Past — The Legal Declaration",
    color: MID_BLUE,
    lightColor: LIGHT_BLUE,
    icon: "⚖",
    description: "Justification is a one-time legal verdict. God declares the believer righteous on the basis of Christ's perfect obedience and atoning death. It is received through faith, not through the works of the law — the animal sacrifice system that could never take away sin. The guilt of sin is removed and the believer is at peace with God.",
    verses: ["Romans 5:1", "Romans 3:28", "Galatians 2:16", "Ephesians 2:8-9"],
    keywords: ["By faith", "One-time event", "Legal declaration", "Removes guilt", "Not by works of the law"]
  },
  {
    id: "sanctification",
    label: "Sanctification",
    sublabel: "Present — The Ongoing Transformation",
    color: GREEN,
    lightColor: LIGHT_GREEN,
    icon: "↑",
    description: "Sanctification is the ongoing process of being made holy. It is where obedience, works and keeping the commandments belong. Genuine faith produces real fruit. The absence of fruit raises serious questions about whether justification was genuine. This is where the commandments, the Sabbath, circumcision and the feast days fit — not as the basis of salvation but as the evidence of a transformed life.",
    verses: ["1 John 2:3-4", "James 2:17-18", "James 2:24", "Romans 2:13", "Hebrews 10:26-27", "John 14:15", "1 John 5:3", "Matthew 16:27", "Revelation 20:12", "Philippians 2:12", "2 Corinthians 7:1"],
    keywords: ["Ongoing process", "Produces works", "Keeps commandments", "Faith made visible", "Judged by works"]
  },
  {
    id: "glorification",
    label: "Glorification",
    sublabel: "Future — The Final Redemption",
    color: GOLD,
    lightColor: LIGHT_GOLD,
    icon: "★",
    description: "Glorification is the final and complete salvation of the believer. The body is resurrected and transformed. Sin is fully and finally absent. The kingdom of God is established on the restored earth. New Jerusalem comes down. God dwells with His people forever.",
    verses: ["1 Corinthians 15:51-52", "Revelation 21:1-3", "Romans 8:30", "Zechariah 14:4,9"],
    keywords: ["Resurrection body", "Earth restored", "Kingdom of God", "No more sin", "God dwells with men"]
  }
];

export default function SalvationDiagram() {
  const [selected, setSelected] = useState<string>("pre");
  const [openVerse, setOpenVerse] = useState<string | null>(null);

  const selectedStage = stages.find(s => s.id === selected);

  return (
    <div style={{ fontFamily: "Georgia, serif", maxWidth: 860, margin: "0 auto", padding: 24, backgroundColor: "#FAFAFA", minHeight: "100vh" }}>

      {/* Verse Modal */}
      {openVerse && (
        <div
          onClick={() => setOpenVerse(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 24
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 28,
              maxWidth: 500,
              width: "100%",
              border: `2px solid ${stages.find(s => s.verses.includes(openVerse))?.color || MID_BLUE}`,
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <p style={{
                color: stages.find(s => s.verses.includes(openVerse))?.color || MID_BLUE,
                fontWeight: "bold", fontSize: 15, margin: 0,
                fontFamily: "Arial, sans-serif"
              }}>
                {openVerse} (KJV)
              </p>
              <button
                onClick={() => setOpenVerse(null)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: GRAY, fontSize: 20, padding: "0 0 0 16px", lineHeight: 1,
                  flexShrink: 0
                }}
              >✕</button>
            </div>
            <div style={{
              backgroundColor: stages.find(s => s.verses.includes(openVerse))?.lightColor || LIGHT_BLUE,
              borderRadius: 10, padding: 16
            }}>
              {explainers[openVerse] && (
                <p style={{ color: "#3A3A3A", fontSize: 13, lineHeight: 1.7, margin: "0 0 10px 0", fontFamily: "Arial, sans-serif", borderBottom: `1px solid ${stages.find(s => s.verses.includes(openVerse))?.color || MID_BLUE}44`, paddingBottom: 10 }}>
                  {explainers[openVerse]}
                </p>
              )}
              <p style={{ color: "#1A1A1A", fontSize: 15, lineHeight: 1.9, margin: 0, fontStyle: "italic" }}>
                {scriptures[openVerse]}
              </p>
            </div>
            <button
              onClick={() => setOpenVerse(null)}
              style={{
                marginTop: 16, width: "100%",
                backgroundColor: stages.find(s => s.verses.includes(openVerse))?.color || MID_BLUE,
                color: "white", border: "none", borderRadius: 8,
                padding: "10px 0", cursor: "pointer", fontSize: 13,
                fontFamily: "Arial, sans-serif", fontWeight: "bold"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ color: DARK_BLUE, fontSize: 24, fontWeight: "bold", margin: 0, letterSpacing: 0.5 }}>
          Salvation — The Full Biblical Picture
        </h1>
        <p style={{ color: GRAY, fontSize: 13, marginTop: 8, fontStyle: "italic", fontFamily: "Arial, sans-serif" }}>
          Tap a stage to explore · Tap any scripture to read the verse
        </p>
      </div>

      {/* Stage Selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
        {stages.map((stage, index) => (
          <div key={stage.id} style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setSelected(stage.id)}
              style={{
                backgroundColor: selected === stage.id ? stage.color : stage.lightColor,
                color: selected === stage.id ? "white" : stage.color,
                border: `2px solid ${stage.color}`,
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                textAlign: "center",
                minWidth: 130,
                transition: "all 0.2s",
                boxShadow: selected === stage.id ? `0 4px 12px ${stage.color}44` : "none"
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 3 }}>{stage.icon}</div>
              <div style={{ fontSize: 12, fontWeight: "bold", lineHeight: 1.2, fontFamily: "Arial, sans-serif" }}>{stage.label}</div>
              {stage.sublabel && (
                <div style={{ fontSize: 9, marginTop: 3, opacity: 0.9, lineHeight: 1.2, fontFamily: "Arial, sans-serif" }}>{stage.sublabel}</div>
              )}
            </button>
            {index < stages.length - 1 && (
              <div style={{ fontSize: 20, color: GRAY, margin: "0 3px" }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedStage && (
        <div style={{
          backgroundColor: "white",
          border: `2px solid ${selectedStage.color}`,
          borderLeft: `6px solid ${selectedStage.color}`,
          borderRadius: 14,
          padding: 22,
          marginBottom: 20,
          boxShadow: `0 4px 16px ${selectedStage.color}18`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              backgroundColor: selectedStage.color,
              color: "white",
              borderRadius: "50%",
              width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0
            }}>
              {selectedStage.icon}
            </div>
            <div>
              <h2 style={{ color: selectedStage.color, margin: 0, fontSize: 18, fontWeight: "bold" }}>{selectedStage.label}</h2>
              {selectedStage.sublabel && (
                <p style={{ color: GRAY, margin: 0, fontSize: 12, fontFamily: "Arial, sans-serif" }}>{selectedStage.sublabel}</p>
              )}
            </div>
          </div>

          <p style={{ color: "#1A1A1A", fontSize: 14, lineHeight: 1.8, marginBottom: 14, fontFamily: "Arial, sans-serif" }}>
            {selectedStage.description}
          </p>

          {selectedStage.keywords.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {selectedStage.keywords.map(kw => (
                <span key={kw} style={{
                  backgroundColor: selectedStage.lightColor,
                  color: selectedStage.color,
                  border: `1px solid ${selectedStage.color}`,
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 11, fontWeight: "bold",
                  fontFamily: "Arial, sans-serif"
                }}>
                  {kw}
                </span>
              ))}
            </div>
          )}

          <div style={{ backgroundColor: selectedStage.lightColor, borderRadius: 8, padding: 12 }}>
            <p style={{ color: selectedStage.color, fontWeight: "bold", fontSize: 11, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Arial, sans-serif" }}>
              Key Scriptures — tap to read
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selectedStage.verses.map(v => (
                <button
                  key={v}
                  onClick={() => setOpenVerse(v)}
                  style={{
                    backgroundColor: "white",
                    color: selectedStage.color,
                    border: `1px solid ${selectedStage.color}`,
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "500"
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relationships */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: DARK_BLUE, fontSize: 13, marginBottom: 10, fontFamily: "Arial, sans-serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
          How They Connect
        </h3>
        {[
          { from: "justification", to: "sanctification", label: "Genuine faith produces obedience", verse: "James 2:17", note: "Faith without works is dead" },
          { from: "sanctification", to: "glorification", label: "Faithful obedience rewarded", verse: "Matthew 16:27", note: "Rewarded according to works" }
        ].map((rel, i) => {
            const fromStage = stages.find(s => s.id === rel.from)!;
            const toStage = stages.find(s => s.id === rel.to)!;
          return (
            <div key={i} style={{
              backgroundColor: "white",
              border: "1px solid #E0E0E0",
              borderRadius: 10,
              padding: 12,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap"
            }}>
              <span style={{ color: fromStage.color, fontWeight: "bold", fontSize: 12, fontFamily: "Arial, sans-serif" }}>{fromStage.label}</span>
              <span style={{ color: GRAY, fontSize: 16 }}>→</span>
              <span style={{ color: toStage.color, fontWeight: "bold", fontSize: 12, fontFamily: "Arial, sans-serif" }}>{toStage.label}</span>
              <div style={{ flex: 1, borderLeft: "1px solid #E0E0E0", paddingLeft: 10, minWidth: 200 }}>
                <p style={{ margin: "0 0 2px 0", fontSize: 12, color: "#1A1A1A", fontFamily: "Arial, sans-serif" }}>{rel.label}</p>
                <button
                  onClick={() => setOpenVerse(rel.verse)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: MID_BLUE, fontSize: 11, padding: 0, fontStyle: "italic",
                    fontFamily: "Arial, sans-serif", textDecoration: "underline"
                  }}
                >
                  {rel.verse} — {rel.note}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Works vs Works of the Law Callout */}
      <div style={{
        backgroundColor: LIGHT_PURPLE,
        border: `2px solid ${PURPLE}`,
        borderLeft: `6px solid ${PURPLE}`,
        borderRadius: 10,
        padding: 16,
        marginBottom: 14
      }}>
        <p style={{ color: PURPLE, fontWeight: "bold", fontSize: 11, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Arial, sans-serif" }}>
          Works vs. Works of the Law — Know the Difference
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, backgroundColor: "white", borderRadius: 8, padding: 12, border: `1px solid ${PURPLE}44` }}>
            <p style={{ color: PURPLE, fontWeight: "bold", fontSize: 12, margin: "0 0 6px 0", fontFamily: "Arial, sans-serif" }}>Works of the Law</p>
            <p style={{ color: "#1A1A1A", fontSize: 12, lineHeight: 1.7, margin: "0 0 8px 0", fontFamily: "Arial, sans-serif" }}>
              The animal sacrifice system. The Levitical priesthood. The ceremonial system added 430 years after Abraham because Israel could not keep the commandments.
            </p>
            <p style={{ color: "#1A1A1A", fontSize: 12, lineHeight: 1.7, margin: "0 0 8px 0", fontStyle: "italic", fontFamily: "Arial, sans-serif" }}>
              Could never take away sin. Pointed forward to Christ. Ended at the cross when the veil tore.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["Galatians 3:19", "Hebrews 10:4", "Jeremiah 7:22"].map(v => (
                <button key={v} onClick={() => setOpenVerse(v)}
                  style={{ backgroundColor: LIGHT_PURPLE, color: PURPLE, border: `1px solid ${PURPLE}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200, backgroundColor: "white", borderRadius: 8, padding: 12, border: `1px solid ${GREEN}44` }}>
            <p style={{ color: GREEN, fontWeight: "bold", fontSize: 12, margin: "0 0 6px 0", fontFamily: "Arial, sans-serif" }}>Works</p>
            <p style={{ color: "#1A1A1A", fontSize: 12, lineHeight: 1.7, margin: "0 0 8px 0", fontFamily: "Arial, sans-serif" }}>
              The fruit of genuine faith. Obedience to God's commandments. Actively perfecting holiness. The outward evidence of an inward transformation.
            </p>
            <p style={{ color: "#1A1A1A", fontSize: 12, lineHeight: 1.7, margin: "0 0 8px 0", fontStyle: "italic", fontFamily: "Arial, sans-serif" }}>
              Evidences real faith. Required for final justification before God. What believers are judged by at the last day.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["Romans 2:13", "James 2:24", "2 Corinthians 7:1", "Philippians 2:12"].map(v => (
                <button key={v} onClick={() => setOpenVerse(v)}
                  style={{ backgroundColor: LIGHT_GREEN, color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Distinction */}
      <div style={{
        backgroundColor: LIGHT_GOLD,
        border: `2px solid ${GOLD}`,
        borderLeft: `6px solid ${GOLD}`,
        borderRadius: 10,
        padding: 16,
        marginBottom: 14
      }}>
        <p style={{ color: GOLD, fontWeight: "bold", fontSize: 11, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Arial, sans-serif" }}>
          The Key Distinction
        </p>
        <p style={{ color: "#1A1A1A", fontSize: 13, lineHeight: 1.8, margin: 0, fontFamily: "Arial, sans-serif" }}>
          The works of the law — the animal sacrifice system — do not earn justification. That system ended at the cross because it could never take away sin. But genuine faith produces works, and Paul himself says the doers of the law shall be justified (Romans 2:13). The commandments, the Sabbath, circumcision and the feast days belong to sanctification — not as a ladder to climb to God, but as the outward evidence of an inward transformation. The absence of that evidence raises a serious question about whether the inward work was real.
        </p>
      </div>

      {/* 1 John 2:3-4 */}
      <div style={{
        backgroundColor: LIGHT_BLUE,
        border: `2px solid ${MID_BLUE}`,
        borderLeft: `6px solid ${MID_BLUE}`,
        borderRadius: 10,
        padding: 16
      }}>
        <button
          onClick={() => setOpenVerse("1 John 2:3-4")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: MID_BLUE, fontWeight: "bold", fontSize: 12,
            margin: "0 0 8px 0", padding: 0,
            fontFamily: "Arial, sans-serif", textDecoration: "underline",
            display: "block"
          }}
        >
          1 John 2:3–4 (KJV) — tap to read
        </button>
        <p style={{ color: "#1A1A1A", fontSize: 13, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
          "And hereby we do know that we know him, if we keep his commandments.
          He that saith, I know him, and keepeth not his commandments, is a liar, and the truth is not in him."
        </p>
      </div>

    </div>
  );
}
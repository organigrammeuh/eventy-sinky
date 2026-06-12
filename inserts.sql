-- ============================================================
-- REALISTIC TEST DATA — Tech Conference: "DevSummit 2025"
-- ============================================================

-- ============================================================
-- EXTRA EVENT: OpenData Summit 2025
-- (new speakers, rooms, sessions, questions & links included)
-- ============================================================

-- USERS (new attendees / speakers for this event)
INSERT INTO "user" (id, email, password, role) VALUES
  ('a1b2c3d4-0008-0008-0008-000000000008', 'lena.schmidt@dataworks.de',   '$2b$12$QvT3Wu4Xz5cPrO8My2EkRxYzLiGgMvFwAaXbScPdZwUeRoJiTKI', 'speaker'),
  ('a1b2c3d4-0009-0009-0009-000000000009', 'james.okafor@un.org',         '$2b$12$RwU4Xv5Yz6dQsP9Nz3FlSyZmMjHhNwGxBbYcTdQeZwUeRoJiTKI', 'speaker'),
  ('a1b2c3d4-0010-0010-0010-000000000010', 'fatima.al-rashid@civic.io',   '$2b$12$SxV5Yw6Za7eRtQ0Oa4GmTzAnNkIiOxHyCcZdUeRfZwUeRoJiTKI', 'attendee'),
  ('a1b2c3d4-0011-0011-0011-000000000011', 'david.park@nytimes.com',      '$2b$12$TyW6Zx7Ab8fSuR1Pb5HnUaBoOlJjPyIzDdAeVfSgZwUeRoJiTKI', 'attendee');

-- ROOMS
INSERT INTO room (id, name) VALUES
  ('b1000000-0007-0007-0007-000000000007', 'Conference Centre Main Hall'),
  ('b1000000-0008-0008-0008-000000000008', 'Seminar Room A — Policy & Governance'),
  ('b1000000-0009-0009-0009-000000000009', 'Seminar Room B — Engineering Track'),
  ('b1000000-0010-0010-0010-000000000010', 'Hands-On Lab — Data Studio');

-- SPEAKERS
INSERT INTO speaker (id, full_name, profile_picture_url, biography) VALUES
  (
    'c1000000-0006-0006-0006-000000000006',
    'Dr. Lena Schmidt',
    'https://cdn.opendatasummit.org/speakers/lena-schmidt.jpg',
    'Dr. Lena Schmidt is a principal data engineer and open data advocate at DataWorks GmbH, a Berlin-based consultancy specialising in public sector data infrastructure across the European Union. She holds a PhD in Information Science from Humboldt University and has spent the last twelve years building the technical and policy foundations that make open government data actually useful — a challenge she describes as "60% engineering, 40% convincing people that CSV is not a data format."

Lena is the lead architect of the EU Open Data Portal''s backend infrastructure, a federated system ingesting metadata from 27 member state data portals in 23 languages, normalising schemas across wildly inconsistent national standards, and serving over 8 million API calls per month. The system''s design — a CQRS event-sourced architecture underpinned by Apache Kafka and a purpose-built metadata reconciliation engine — has become something of a reference implementation in the civic tech community.

Before DataWorks, Lena worked at the German Federal Agency for Cartography and Geodesy, where she led the migration of Germany''s national geospatial data catalogue to DCAT-AP, the EU''s application profile for data portals. She is a co-author of the DCAT-AP 3.0 specification and sits on the W3C Dataset Exchange Working Group.

Lena is a regular speaker at FOSS4G, Open Knowledge Festival, and re:publica, and writes a bilingual (German/English) newsletter called "Verwaltungsdaten" — roughly translatable as "Bureaucratic Data" — that combines dry technical commentary with an even drier sense of humour about European public administration.'
  ),
  (
    'c1000000-0007-0007-0007-000000000007',
    'James Okafor',
    'https://cdn.opendatasummit.org/speakers/james-okafor.jpg',
    'James Okafor is a data scientist and humanitarian technologist at the United Nations Office for the Coordination of Humanitarian Affairs (OCHA), where he leads the data innovation team within the Centre for Humanitarian Data in The Hague. His work sits at the intersection of data ethics, crisis informatics, and the practical constraints of operating data infrastructure in environments with intermittent connectivity, minimal budget, and high stakes.

Over the past eight years, James has designed data pipelines and analytical systems that inform life-critical decisions in active humanitarian operations across South Sudan, Syria, Yemen, and the Rohingya response in Bangladesh. A recurring theme in his work is the gap between the richness of data that exists in crisis settings and the poverty of the infrastructure available to make it accessible and actionable — a gap he addresses through a combination of lightweight open-source tooling, aggressive denormalisation, and radical simplicity.

James is the creator of HDX Signals, an automated monitoring system that tracks changes in 80+ humanitarian datasets and surfaces anomalies that may indicate deteriorating conditions before they appear in situation reports. He is also a co-author of the Humanitarian Data Exchange (HDX) platform''s open data architecture, used by over 20,000 humanitarian workers globally.

He holds a BSc in Statistics from the University of Lagos and an MSc in Data Science from the University of Amsterdam. He speaks English, French, Yoruba, and functional Swahili. He is a dedicated amateur footballer and an unlikely enthusiast of 1970s progressive rock.'
  );

-- EVENT
INSERT INTO event (id, title, description, start_date, end_date, place) VALUES
  (
    'e1000000-0003-0003-0003-000000000003',
    'OpenData Summit 2025',
    'OpenData Summit 2025 is the premier European gathering for practitioners, policymakers, and engineers working at the intersection of open data, civic technology, and public sector digital transformation. Now in its seventh edition, the summit brings together approximately 800 participants from national governments, supranational institutions, civil society organisations, academic research groups, and the private sector companies building products on top of open datasets.

This year''s programme is anchored around three questions the community has been circling for half a decade without satisfactory answers: Why is most open data still effectively unusable in practice? Who bears the cost of data quality, and how should that cost be distributed? And what would a genuine data commons look like as a technical and legal structure, not just a rhetorical flourish?

The summit runs two parallel tracks across two days. The Policy and Governance track examines the regulatory landscape — particularly the implications of the EU Data Act, the Open Data Directive, and the emerging AI Act''s training data provisions for public datasets — and features structured debate formats alongside traditional presentations. The Engineering track is uncompromisingly technical: sessions cover open data pipeline architecture, federated data catalogue design, data quality automation, geospatial data standards, and the specific challenges of building reliable systems on top of inherently unreliable third-party data sources.

A particular focus this year is the practical integration of open data into AI and machine learning workflows, including the provenance tracking, licensing, and quality assurance challenges that responsible AI development requires but that most open data portals are poorly equipped to support. A half-day workshop on the final afternoon gives participants hands-on experience building a production-ready open data ingestion pipeline.

The summit is co-organised by the Open Knowledge Foundation, the European Commission''s data.europa.eu team, and DataWorks GmbH. All presentations are delivered in English. The event is carbon-neutral and catering is entirely plant-based.',
    '2025-11-20 09:00:00',
    '2025-11-21 17:00:00',
    'dbb — Akademie für Führungskräfte, Berlin, Germany'
  );

-- SESSIONS
INSERT INTO session (id, title, description, start_date, end_date, capacity, id_event, id_room) VALUES
  (
    'd1000000-0007-0007-0007-000000000007',
    'Opening Keynote: The Open Data Paradox — Why More Data Hasn''t Meant More Use',
    'Despite two decades of open data mandates, international charters, and portal proliferation, the actual use of government open data by developers, researchers, and civil society organisations remains strikingly low relative to what has been published. This keynote by Dr. Lena Schmidt opens the summit with a rigorous diagnosis of why.

Lena argues that the open data movement made a foundational category error early on: it treated publication as the end goal rather than use. The result is a landscape of portals optimised for compliance metrics — number of datasets published, number of file formats offered, percentage of metadata fields filled — rather than for the workflows of the people who might actually consume and act on the data.

Drawing on a study of 340 European open data portals conducted over the previous 18 months, Lena presents an unsettling typology of open data failure modes. Phantom datasets: datasets that are listed in a portal but return 404s from their actual download URLs. Frozen portals: datasets that have not been updated in over two years despite describing conditions (unemployment rates, hospital capacity, traffic flow) that change daily. Schema avalanche: portals where the same logical dataset is published in nine incompatible formats by nine different sub-agencies, each with its own column naming convention. And metadata debt: datasets for which the primary documentation is a zip file containing a Word document from 2009 that references a data collection methodology that no longer exists.

The keynote is not entirely pessimistic. Lena closes with a set of design principles for open data infrastructure that centres the data consumer rather than the data publisher, illustrated with examples from the Netherlands, Estonia, and Canada that demonstrate what genuinely usable open data infrastructure looks like when organisations commit to it.',
    '2025-11-20 09:00:00',
    '2025-11-20 10:15:00',
    700,
    'e1000000-0003-0003-0003-000000000003',
    'b1000000-0007-0007-0007-000000000007'
  ),
  (
    'd1000000-0008-0008-0008-000000000008',
    'Data Pipelines for Crisis: Building Reliable Infrastructure on Unreliable Data in Humanitarian Operations',
    'This session by James Okafor is a technically frank account of what it takes to build data infrastructure that supports life-critical decisions in humanitarian emergencies — and why almost every assumption that works in a commercial data engineering context needs to be re-examined.

James begins with the operating environment: a data pipeline serving a humanitarian response in an active conflict zone must contend with sources that go offline for days without notice, reporting entities that change their schema mid-operation without versioning or documentation, numerical data that has been manually transcribed from paper forms by people working in extremely stressful conditions, and political sensitivities that mean certain data can be ingested but not published, or published but only in aggregated form.

He walks through the architecture of HDX Signals in detail: how the system ingests updates from 80+ datasets across 15 data sources, applies a multi-layer quality scoring model that distinguishes between stale data, inconsistent data, and absent data, and generates automated situation monitoring reports that are now used by operations teams in six ongoing responses. A significant portion of the session covers the quality scoring model itself — a gradient boosting classifier trained on historical data labelled by experienced humanitarian information managers — and the specific features that turned out to be most predictive of data reliability in crisis contexts.

James is candid about failures. A particularly instructive incident during the 2023 Türkiye earthquake response saw the pipeline''s anomaly detection miss a significant data quality degradation for 72 hours because the degradation pattern fell outside the model''s training distribution. He walks through what the team learned and the monitoring changes implemented as a result.

The session is aimed at data engineers who want to understand how reliability engineering principles apply — and where they break down — in high-stakes, low-resource environments.',
    '2025-11-20 11:00:00',
    '2025-11-20 12:15:00',
    200,
    'e1000000-0003-0003-0003-000000000003',
    'b1000000-0009-0009-0009-000000000009'
  ),
  (
    'd1000000-0009-0009-0009-000000000009',
    'Workshop: Building a Production Open Data Ingestion Pipeline with DCAT-AP, dbt, and DuckDB',
    'This half-day hands-on workshop gives participants direct experience building an end-to-end open data ingestion pipeline that is robust enough to handle the messy reality of real government data sources. Led by Dr. Lena Schmidt, the session uses three live European open data portals as sources and builds a pipeline that ingests, validates, normalises, and serves their datasets through a queryable API — all using open-source tooling that can be run locally or deployed for under €20/month.

The workshop is structured in four blocks:

Block 1 — Understanding DCAT-AP (45 min): Participants work directly with the DCAT-AP 3.0 metadata specification, learning how to parse RDF/Turtle and JSON-LD catalogue responses, extract dataset and distribution metadata, and identify the common ways that real portals deviate from the standard. Each participant writes a small Python parser and runs it against three real portals, observing the specific compliance failures that Lena described in her keynote.

Block 2 — Ingestion and validation with dbt (50 min): Participants build a dbt project that models the raw ingested metadata into a normalised schema, applies data quality tests using dbt''s built-in test framework, and generates a data catalogue document. Lena demonstrates how to use dbt''s source freshness feature to track upstream staleness and surface it in the pipeline''s outputs.

Block 3 — Analytics and serving with DuckDB (45 min): Participants load their normalised dataset into DuckDB and write a set of analytical queries to profile data quality across their ingested portals: staleness distributions, format coverage, licence type breakdowns, and geographic coverage gaps. They then use DuckDB''s JSON output mode to serve query results through a lightweight FastAPI endpoint.

Block 4 — Production concerns (40 min): Scheduling, incremental ingestion, schema change detection, alerting, and a discussion of where this architecture reaches its limits and what the migration path looks like toward a more fully-featured platform.

Prerequisites: Python 3.11+, Docker, a laptop with at least 8GB RAM. All tooling is provided as a Docker Compose stack. Participants should clone the workshop repository before arrival.',
    '2025-11-21 13:00:00',
    '2025-11-21 17:00:00',
    40,
    'e1000000-0003-0003-0003-000000000003',
    'b1000000-0010-0010-0010-000000000010'
  );

-- SESSION_SPEAKER
INSERT INTO session_speaker (id_session, id_speaker) VALUES
  ('d1000000-0007-0007-0007-000000000007', 'c1000000-0006-0006-0006-000000000006'),
  ('d1000000-0008-0008-0008-000000000008', 'c1000000-0007-0007-0007-000000000007'),
  ('d1000000-0009-0009-0009-000000000009', 'c1000000-0006-0006-0006-000000000006');

-- QUESTIONS
INSERT INTO question (id, content, name, upvotes, creation_datetime, id_session) VALUES
  (
    'f1000000-0009-0009-0009-000000000009',
    'You described "phantom datasets" — datasets listed in a portal with broken download URLs — as a systemic problem across European portals. Is there any evidence that the portals themselves are aware of this, or is the absence of automated link-checking symptomatic of a deeper organisational problem where nobody is accountable for the consumer experience after a dataset is published?',
    'David Park',
    34,
    '2025-11-20 09:51:00',
    'd1000000-0007-0007-0007-000000000007'
  ),
  (
    'f1000000-0010-0010-0010-000000000010',
    'The Estonian and Dutch examples you cited as positive models both have relatively small, technically sophisticated public administrations. Do you think the design principles you identified are genuinely transferable to larger, more federated government structures like Germany or the US federal government, or are those success stories partly just a function of country size and administrative coherence?',
    'Fatima Al-Rashid',
    29,
    '2025-11-20 10:02:00',
    'd1000000-0007-0007-0007-000000000007'
  ),
  (
    'f1000000-0011-0011-0011-000000000011',
    'The gradient boosting model you use for data quality scoring — how do you handle the cold-start problem for a new crisis response where you have no historical data from that specific context? Do you fall back to a rule-based system, use transfer learning from the most geographically similar past response, or something else entirely?',
    NULL,
    41,
    '2025-11-20 11:47:00',
    'd1000000-0008-0008-0008-000000000008'
  ),
  (
    'f1000000-0012-0012-0012-000000000012',
    'You mentioned political sensitivities around data that can be ingested but not published in granular form. How does your team handle cases where the aggregation required to protect sensitive populations is so coarse that it destroys the analytical value of the dataset — especially when that value is precisely what''s needed to advocate for those populations with donors and governments?',
    'James audience member',
    18,
    '2025-11-20 11:58:00',
    'd1000000-0008-0008-0008-000000000008'
  );

-- LINKS
INSERT INTO link ( url, type, id_speaker) VALUES
  ('https://dataworks.de/team/lena-schmidt',       'website',  'c1000000-0006-0006-0006-000000000006'),
  ('https://github.com/lena-schmidt-opendata',     'github',   'c1000000-0006-0006-0006-000000000006'),
  ('https://verwaltungsdaten.substack.com',        'blog',     'c1000000-0006-0006-0006-000000000006'),
  ('https://linkedin.com/in/lena-schmidt-dcat',    'linkedin', 'c1000000-0006-0006-0006-000000000006'),
  ('https://ocha.unocha.org/james-okafor',         'website',  'c1000000-0007-0007-0007-000000000007'),
  ('https://github.com/jokafor-hdx',               'github',   'c1000000-0007-0007-0007-000000000007'),
  ('https://linkedin.com/in/james-okafor-ocha',    'linkedin', 'c1000000-0007-0007-0007-000000000007'),
  ('https://data.humdata.org/user/jokafor',        'hdx',      'c1000000-0007-0007-0007-000000000007');

-- ============================================================ (end of extra event)
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO "user" (id, email, password, role) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'admin@devsummit.io',        '$2b$12$KIXm1P8Qz4fvR3jL9yN0OuWtHkEcDpGqA7sVxCbMnYlZwUeRoJiT', 'admin'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'sarah.organizer@devsummit.io','$2b$12$XmN7Qp4Rv9wKjL2Hs6YeOtWuFdCbGpAq8sVxMnZlYwUeRoJiTKI', 'organizer'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'john.doe@example.com',       '$2b$12$LpQ8Rn5Sv0xKmJ3Ht7ZfPuWvGdCbHqAr9sVyNnZlYwUeRoJiTKI', 'attendee'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'maria.garcia@techcorp.com',  '$2b$12$MqR9Sp6Tv1yLnK4Iu8AgQvXwHeCcIrBs0tWzOnAlZwUeRoJiTKI', 'attendee'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'alex.chen@startup.io',       '$2b$12$NrS0Tq7Uw2zMoL5Jv9BhRwYxIfDdJsCtXuApPbMaZwUeRoJiTKI', 'speaker'),
  ('a1b2c3d4-0006-0006-0006-000000000006', 'priya.patel@openai.com',     '$2b$12$OsT1Ur8Vx3aNpM6Kw0CiSxZyJgEeKtDuYvBqQcNbZwUeRoJiTKI', 'speaker'),
  ('a1b2c3d4-0007-0007-0007-000000000007', 'marco.rossi@cloudnative.eu', '$2b$12$PtU2Vs9Wy4bOqN7Lx1DjTyAzKhFfLuEvZwCrRdOcZwUeRoJiTKI', 'speaker');


-- ============================================================
-- EVENTS
-- ============================================================
INSERT INTO event (id, title, description, start_date, end_date, place) VALUES
  (
    'e1000000-0001-0001-0001-000000000001',
    'DevSummit 2025',
    'DevSummit 2025 is a three-day international software engineering conference bringing together over 2,000 developers, architects, and tech leaders from across the globe. This year''s theme — "Engineering for Scale" — explores the tools, patterns, and mindsets required to build systems that serve millions of users while remaining maintainable and humane for the teams behind them.

The conference spans four concurrent tracks: distributed systems and cloud-native infrastructure, artificial intelligence and ML engineering, developer experience and platform engineering, and open source sustainability. Each track features a carefully curated mix of keynotes, deep-dive technical sessions, live coding workshops, and panel discussions.

Attendees can expect hands-on labs with real production infrastructure, a 48-hour open source hackathon, and a dedicated networking lounge where serendipitous conversations have historically led to actual product launches. Past editions have attracted engineers from companies such as Stripe, Vercel, Cloudflare, Hugging Face, and dozens of high-growth startups.

Lunch, coffee, and evening socials are included. All sessions will be recorded and made available to registered attendees for 12 months after the event.',
    '2025-10-14 09:00:00',
    '2025-10-16 18:30:00',
    'Palais des Congrès, Montreal, Canada'
  ),
  (
    'e1000000-0002-0002-0002-000000000002',
    'AI Engineering Workshop Day',
    'A focused, single-day pre-conference workshop exclusively for practitioners who want to move beyond surface-level AI integration and understand how to engineer reliable, production-grade AI features into real products.

The day is structured as a progression: participants start with a foundational session on LLM internals and prompt engineering best practices, then move into retrieval-augmented generation (RAG) architecture, fine-tuning workflows, evaluation frameworks, and finally production concerns such as latency budgets, cost management, and safety guardrails.

All exercises use real datasets and open-source tooling — no vendor-specific SDKs required. Each participant receives a cloud sandbox environment pre-loaded with the models and infrastructure used in the examples. The session is deliberately capped at 60 attendees to maintain a high facilitator-to-participant ratio and enable genuine problem-solving rather than passive absorption.

Breakfast and lunch are provided. Participants are expected to have at least 18 months of software engineering experience. No prior ML background is required, but comfort with Python is assumed.',
    '2025-10-13 08:30:00',
    '2025-10-13 17:30:00',
    'Palais des Congrès, Room 206B, Montreal, Canada'
  );


-- ============================================================
-- ROOMS
-- ============================================================
INSERT INTO room (id, name) VALUES
  ('b1000000-0001-0001-0001-000000000001', 'Grand Auditorium'),
  ('b1000000-0002-0002-0002-000000000002', 'Hall A — Distributed Systems'),
  ('b1000000-0003-0003-0003-000000000003', 'Hall B — AI & Machine Learning'),
  ('b1000000-0004-0004-0004-000000000004', 'Workshop Room 1'),
  ('b1000000-0005-0005-0005-000000000005', 'Workshop Room 2'),
  ('b1000000-0006-0006-0006-000000000006', 'Lightning Talks Stage');


-- ============================================================
-- SPEAKERS
-- ============================================================
INSERT INTO speaker (id, full_name, profile_picture_url, biography) VALUES
  (
    'c1000000-0001-0001-0001-000000000001',
    'Dr. Evelyn Rhodes',
    'https://cdn.devsummit.io/speakers/evelyn-rhodes.jpg',
    'Dr. Evelyn Rhodes is a distributed systems researcher and principal engineer at Cloudstream, where she leads the consistency and fault-tolerance working group. She holds a PhD in Computer Science from MIT, where her dissertation on CRDTs in geo-distributed databases received the ACM SIGOPS Best Paper award in 2019.

Over the past decade, Evelyn has been an active contributor to the Apache Kafka and etcd projects, authoring several widely-adopted RFCs on log compaction and lease-based leader election. She is perhaps best known in the community for her long-running blog series "Notes on Distributed Minds," which has been cited in university syllabi across four continents.

Before joining Cloudstream, Evelyn spent five years at Google where she worked on Spanner''s external consistency mechanisms and later led a small team building the data pipelines that underpin Google Maps real-time transit information. She holds six patents in the areas of distributed consensus and atomic broadcast.

Outside of engineering, Evelyn is a passionate advocate for increasing the representation of women in systems programming. She mentors through the Code2040 and SWE programs and gives roughly a dozen public talks per year. In her spare time she builds mechanical keyboards and competes in amateur orienteering.'
  ),
  (
    'c1000000-0002-0002-0002-000000000002',
    'Tariq Hassan',
    'https://cdn.devsummit.io/speakers/tariq-hassan.jpg',
    'Tariq Hassan is the co-founder and CTO of Latency Labs, a developer tools startup building next-generation profiling and observability infrastructure for Rust and Go services. He previously served as Staff Infrastructure Engineer at Shopify, where he was the technical lead for the checkout resilience initiative that reduced cart failure rates by 73% during Black Friday 2022 — a project that became a widely shared case study on graceful degradation at scale.

Tariq began his career writing firmware for embedded medical devices, an experience he credits with instilling an almost pathological obsession with correctness, memory safety, and predictable performance characteristics. He later spent three years at Mozilla contributing to the Servo browser engine, which introduced him to the Rust programming language and set the trajectory for his subsequent career.

A prolific open source contributor, Tariq maintains several popular Rust crates including tokio-backoff, circuit-rs, and metrics-prometheus. He writes a fortnightly newsletter called "The Boring Parts" focused on the unglamorous but critical work of reliability engineering, which has accumulated over 40,000 subscribers. He holds a BEng from the University of Waterloo and an MSc from Carnegie Mellon.'
  ),
  (
    'c1000000-0003-0003-0003-000000000003',
    'Yuki Nakamura',
    'https://cdn.devsummit.io/speakers/yuki-nakamura.jpg',
    'Yuki Nakamura is a machine learning engineer and applied AI researcher currently at Hugging Face, where she works on the open-source LLM evaluation team and leads development of the LM-Harness benchmarking framework. Her work focuses on the intersection of evaluation methodology, alignment, and the practical challenges of deploying large language models in production environments where latency and cost constraints are non-negotiable.

Prior to Hugging Face, Yuki was a research scientist at DeepMind''s language team, contributing to work on constitutional AI and preference learning that informed several published papers at NeurIPS and ICML. She also spent time as an AI safety fellow at the Center for Human-Compatible AI at UC Berkeley, an experience that fundamentally shaped how she thinks about the relationship between capability and reliability in AI systems.

Yuki is a regular contributor to the EleutherAI community and has co-organized the Big Science workshop series. She has a particular interest in multilingual evaluation and the often-overlooked failure modes of LLMs in non-English contexts, a topic she writes about candidly on her Substack.

She holds a BSc in Mathematics and Computer Science from Kyoto University and a Master''s in Statistics from ETH Zürich. She is conversational in Japanese, English, German, and Mandarin.'
  ),
  (
    'c1000000-0004-0004-0004-000000000004',
    'Marcus Webb',
    'https://cdn.devsummit.io/speakers/marcus-webb.jpg',
    'Marcus Webb is a platform engineering lead at Vercel and a core maintainer of the Turborepo monorepo toolchain. He has spent the last eight years focused almost exclusively on developer experience: the invisible connective tissue between an idea in an engineer''s head and a working, deployed feature — and all the friction that accumulates in between.

Before Vercel, Marcus was the first platform engineer at a Series B fintech startup, where he single-handedly migrated a 2 million line monolith to a federated service architecture while keeping the existing CI pipeline green throughout. That 18-month project — equal parts technical challenge and organizational negotiation — gave him a deep appreciation for incremental migration strategies and the human factors of large-scale refactoring.

Marcus is the author of "Boring CI: A Field Guide to Build Infrastructure That Doesn''t Wake You Up," a self-published technical book with over 25,000 copies sold or downloaded. He maintains an active YouTube channel ("Webb on the Web") where his video on optimizing GitHub Actions caches has accumulated over 800,000 views. He is an occasional voice on the Syntax.fm podcast.

He studied Computer Information Systems at Georgia Tech and is based in Atlanta, Georgia.'
  ),
  (
    'c1000000-0005-0005-0005-000000000005',
    'Sofia Andersen',
    'https://cdn.devsummit.io/speakers/sofia-andersen.jpg',
    'Sofia Andersen is a senior engineer on the Kubernetes SIG-Node working group and a CNCF ambassador. She has been working in cloud-native infrastructure since before the term existed, having joined a small SRE team at a Stockholm media company in 2012 that was among the first in Europe to run production workloads on AWS EC2 using what would today be recognized as an immutable infrastructure pattern.

Over the course of her career, Sofia has held roles at Spotify, where she worked on the internal Kubernetes platform serving over 2,000 microservices, and at a Series A infrastructure startup that was later acquired by Grafana Labs. She was also a founding contributor to OpenTelemetry''s Go SDK and has given talks on observability, container runtime security, and eBPF at KubeCon, DockerCon, and SREcon.

Sofia is deeply interested in the human side of platform engineering — particularly how platform teams can measure their impact on developer productivity without resorting to metrics that incentivize the wrong behavior. She writes long-form technical essays at sofiaandersen.dev and occasionally posts uncomfortable opinions about the state of the Kubernetes ecosystem on social media.

She lives in Copenhagen with her partner and two cats, and enjoys distance cycling and experimental cooking.'
  );


-- ============================================================
-- SESSIONS
-- ============================================================
INSERT INTO session (id, title, description, start_date, end_date, capacity, id_event, id_room) VALUES
  (
    'd1000000-0001-0001-0001-000000000001',
    'Keynote: Engineering for Scale — What We Got Wrong, and What We Finally Got Right',
    'The opening keynote of DevSummit 2025 sets the tone for the entire conference with an honest, data-driven retrospective on a decade of distributed systems dogma. Dr. Evelyn Rhodes argues that the industry has consistently over-indexed on horizontal scalability as the default solution to performance problems, while systematically under-investing in the algorithmic and data modeling foundations that make scale tractable in the first place.

Drawing from post-mortems across her career — including an incident at Google that knocked out real-time transit data for 11 European cities — Evelyn makes the case that the most impactful engineering improvements rarely involve adding more machines or switching to a trendier consistency model. More often they involve reading your own query plans, understanding your access patterns, and resisting the gravitational pull of the latest distributed database that promises to solve everything.

The talk covers four concrete areas: the misuse of eventual consistency as an excuse to defer hard problems, the hidden costs of microservice proliferation on latency and developer cognitive load, the surprising performance characteristics of modern NVMe SSDs that invalidate many received wisdoms about I/O-bound systems, and a framework Evelyn calls "principled restraint" for making architectural decisions under uncertainty. Expect sharp opinions, real numbers, and actionable takeaways.',
    '2025-10-14 09:00:00',
    '2025-10-14 10:15:00',
    1500,
    'e1000000-0001-0001-0001-000000000001',
    'b1000000-0001-0001-0001-000000000001'
  ),
  (
    'd1000000-0002-0002-0002-000000000002',
    'Building a Low-Latency Rust Service From Scratch: Architecture, Trade-offs, and Production War Stories',
    'This session is a deep technical dive into the full lifecycle of a high-performance Rust service — from the initial design decisions through to the production incidents that forced a rethink of assumptions made in week one. Tariq Hassan uses a real service built at Latency Labs as the case study: a sub-millisecond rate-limiting and quota enforcement layer that must handle 3 million requests per second across 12 availability zones with a p99 latency budget of 800 microseconds.

The session is structured as a series of decisions: why async Rust over Go for this specific workload, how they chose between Tokio and async-std, what the actual overhead of Arc<Mutex<T>> looks like in practice at this scale, and why they ultimately built a lock-free data structure for their hot path using atomic operations rather than reaching for a pre-built crate.

Tariq is candid about what went wrong. A particularly painful incident where a misunderstood ownership boundary caused a memory leak that only manifested under specific GC pressure patterns from a co-located service took three days to diagnose. He walks through the tooling used — flamegraphs, perf, Valgrind''s massif — and what the team learned about Rust''s compile-time guarantees not being a substitute for runtime profiling.

The session concludes with a set of rules-of-thumb the team has developed for knowing when the performance characteristics of Rust genuinely justify the increased onboarding cost for new engineers, and when a well-tuned Go service would have been the more honest choice.',
    '2025-10-14 11:00:00',
    '2025-10-14 12:15:00',
    300,
    'e1000000-0001-0001-0001-000000000001',
    'b1000000-0002-0002-0002-000000000002'
  ),
  (
    'd1000000-0003-0003-0003-000000000003',
    'Evaluating LLMs in Production: Beyond Benchmarks, Toward Real-World Reliability',
    'The AI industry has a benchmarking problem. Models are routinely evaluated on curated datasets that bear increasingly little resemblance to the messy, ambiguous, domain-specific inputs they encounter in production. This talk by Yuki Nakamura makes the case that teams building LLM-powered products need a fundamentally different evaluation philosophy — one that starts from actual user behavior rather than academic leaderboard positioning.

Yuki begins with an anatomy of benchmark gaming: how models are (often inadvertently) trained on data that overlaps with test sets, why performance on MMLU and HellaSwag predicts almost nothing about performance on a company''s actual use case, and the uncomfortable implication that many teams are making expensive model selection decisions based on numbers that are essentially noise.

The bulk of the talk is practical. Yuki shares a production evaluation framework developed at Hugging Face used to assess models for three distinct product use cases: a multi-turn customer support assistant, a code generation tool, and a document summarization pipeline. She covers how they construct domain-specific evaluation sets using real production logs (with careful attention to privacy), how they use LLM-as-judge patterns responsibly (including the failure modes), and how they track evaluation suite drift over time as user behavior evolves.

The session ends with a discussion of what reliability actually means for AI components in a product — particularly the difference between accuracy, consistency, and calibration — and a set of specific questions attendees can ask their own teams to assess whether their current evaluation setup is telling them anything useful.',
    '2025-10-14 11:00:00',
    '2025-10-14 12:15:00',
    350,
    'e1000000-0001-0001-0001-000000000001',
    'b1000000-0003-0003-0003-000000000003'
  ),
  (
    'd1000000-0004-0004-0004-000000000004',
    'Monorepos at Scale: The Honest Guide to When They Help and When They Hurt',
    'There is a version of the monorepo conversation that happens at every tech conference: a speaker from a large company explains how consolidating their codebase into a single repository transformed their developer velocity and you leave the talk wondering why you haven''t done it yet. This is not that talk.

Marcus Webb has spent the last two years helping a dozen companies migrate to and sometimes away from monorepo setups, and his experience has produced a considerably more nuanced view of when the architecture is appropriate. This session is structured as a decision framework rather than an advocacy piece.

The first half covers the genuine benefits: unified dependency management, atomic cross-project changes, easier code sharing, and the coordination forcing function that a shared trunk provides for large engineering organizations. Marcus uses Turborepo''s remote caching architecture as a concrete example of how these benefits compound at scale.

The second half is the uncomfortable part. Marcus talks about the organizational preconditions that determine whether a monorepo succeeds: the need for strong codeowner tooling, the reality of CI build time growth, the specific failure modes when monorepo tooling is applied to teams with radically different release cadences, and the case studies where the answer was to migrate back to polyrepo — and why that was the right call. He is particularly direct about the pattern of companies adopting monorepos because Google does it, without doing the work to understand what organizational infrastructure makes Google''s approach work.',
    '2025-10-15 14:00:00',
    '2025-10-15 15:15:00',
    280,
    'e1000000-0001-0001-0001-000000000001',
    'b1000000-0004-0004-0004-000000000004'
  ),
  (
    'd1000000-0005-0005-0005-000000000005',
    'eBPF in Production: Observability Without Instrumentation',
    'Extended Berkeley Packet Filter has crossed the threshold from kernel-hacking curiosity to serious production tool. This session by Sofia Andersen is a practical guide to what eBPF is actually good for in 2025, how to use it safely in Kubernetes environments, and where the sharp edges still are.

Sofia opens with a concise explanation of what eBPF does at the kernel level and why the ability to run sandboxed programs in response to kernel events — without modifying kernel source or loading kernel modules — is such a significant architectural shift for observability and security tooling. She spends particular time on the BPF verifier, explaining what it checks, why it exists, and how its constraints shape what programs you can and cannot write.

The core of the session is three production use cases from Sofia''s work at Spotify and her Grafana Labs experience. The first is zero-instrumentation distributed tracing: using eBPF to capture TCP send/receive events and reconstruct service call graphs without requiring any modification to application code or container images. The second is network policy enforcement with sub-millisecond latency using Cilium, including a frank discussion of the operational complexity that Cilium introduces compared to kube-proxy. The third is a runtime security monitoring setup using Falco and Tetragon that detected a supply chain attack on a CI system before it reached production.

The session concludes with guidance on kernel version requirements, the current state of eBPF portability across distributions, and a reading list for engineers who want to go deeper.',
    '2025-10-15 11:00:00',
    '2025-10-15 12:15:00',
    280,
    'e1000000-0001-0001-0001-000000000001',
    'b1000000-0002-0002-0002-000000000002'
  ),
  (
    'd1000000-0006-0006-0006-000000000006',
    'Workshop: Building a RAG Pipeline That Actually Works in Production',
    'Retrieval-augmented generation is the most commonly implemented — and most commonly broken — AI pattern in production today. This three-hour workshop, led by Yuki Nakamura, is designed to help engineers understand not just how to build a RAG pipeline but how to build one that remains reliable as the data and the model evolve.

The workshop is structured around a running example: a technical documentation assistant for a fictitious open-source project with a large, evolving knowledge base. Participants implement each component of the pipeline from scratch using LangChain, Qdrant, and the OpenAI API (alternatives available), then stress-test their implementation against a set of adversarial queries designed to surface common failure modes.

Session breakdown:
 — 45 min: Chunking strategies and why naive fixed-length chunking fails for structured technical content. Participants experiment with semantic chunking using sentence transformers.
 — 45 min: Embedding selection, vector index configuration, and retrieval evaluation using the RAGAS framework.
 — 45 min: Reranking, context compression, and the performance/quality tradeoffs of adding a cross-encoder retrieval stage.
 — 45 min: Production concerns — query caching, index update strategies, hallucination detection, and cost monitoring.

All code is provided as a structured Jupyter notebook. Participants leave with a working pipeline and a checklist of production readiness criteria they can apply to their own systems. Python 3.10+ and a laptop with internet access required.',
    '2025-10-16 09:00:00',
    '2025-10-16 12:00:00',
    60,
    'e1000000-0001-0001-0001-000000000001',
    'b1000000-0005-0005-0005-000000000005'
  );


-- ============================================================
-- SESSION_SPEAKER (join table)
-- ============================================================
INSERT INTO session_speaker (id_session, id_speaker) VALUES
  ('d1000000-0001-0001-0001-000000000001', 'c1000000-0001-0001-0001-000000000001'), -- Keynote → Dr. Evelyn Rhodes
  ('d1000000-0002-0002-0002-000000000002', 'c1000000-0002-0002-0002-000000000002'), -- Rust session → Tariq Hassan
  ('d1000000-0003-0003-0003-000000000003', 'c1000000-0003-0003-0003-000000000003'), -- LLM eval → Yuki Nakamura
  ('d1000000-0004-0004-0004-000000000004', 'c1000000-0004-0004-0004-000000000004'), -- Monorepo → Marcus Webb
  ('d1000000-0005-0005-0005-000000000005', 'c1000000-0005-0005-0005-000000000005'), -- eBPF → Sofia Andersen
  ('d1000000-0006-0006-0006-000000000006', 'c1000000-0003-0003-0003-000000000003'), -- Workshop → Yuki Nakamura
  -- Co-speakers: Evelyn also joins the distributed systems session
  ('d1000000-0002-0002-0002-000000000002', 'c1000000-0001-0001-0001-000000000001');


-- ============================================================
-- QUESTIONS (from attendees during sessions)
-- ============================================================
INSERT INTO question (id, content, name, upvotes, creation_datetime, id_session) VALUES
  (
    'f1000000-0001-0001-0001-000000000001',
    'You mentioned that eventual consistency is often misused as an excuse to defer hard problems. Can you give a concrete example of a system where eventual consistency is the genuinely correct choice — not just the convenient one — and explain how you would argue that case to a skeptical architect who defaults to strong consistency?',
    'Maria Garcia',
    42,
    '2025-10-14 09:47:00',
    'd1000000-0001-0001-0001-000000000001'
  ),
  (
    'f1000000-0002-0002-0002-000000000002',
    'You talked about the surprising performance of modern NVMe SSDs invalidating I/O assumptions. Does this also change your thinking on database engine selection? Specifically, does it weaken the case for LSM-tree based engines like RocksDB in favor of B-tree engines, given that the original motivation for LSM trees was largely about sequential write performance on spinning disk?',
    NULL,
    38,
    '2025-10-14 09:53:00',
    'd1000000-0001-0001-0001-000000000001'
  ),
  (
    'f1000000-0003-0003-0003-000000000003',
    'How do you handle the ownership boundary problem in practice? In the Rust service you described, the memory leak was traced to a misunderstood ownership contract across an async boundary. Is this a gap in the type system that Rust should address, or is it fundamentally a documentation and API design problem that the compiler cannot and should not try to solve?',
    'John Doe',
    27,
    '2025-10-14 11:44:00',
    'd1000000-0002-0002-0002-000000000002'
  ),
  (
    'f1000000-0004-0004-0004-000000000004',
    'We''re building a RAG pipeline for internal legal documents. Our biggest challenge is that the answers often require synthesizing information from three or four different clauses that are spread across a 200-page contract. Standard chunking strategies completely destroy the relational context. Have you seen approaches that deal specifically with long-range dependencies within a single document, beyond just increasing the chunk overlap?',
    'Alex Chen',
    31,
    '2025-10-14 11:39:00',
    'd1000000-0003-0003-0003-000000000003'
  ),
  (
    'f1000000-0005-0005-0005-000000000005',
    'At what point does evaluating LLM outputs with another LLM (LLM-as-judge) become circular? If both the model being evaluated and the evaluator model share training data lineage, are we just measuring something like inter-model agreement on a shared distribution rather than anything that resembles ground truth quality?',
    NULL,
    56,
    '2025-10-14 11:52:00',
    'd1000000-0003-0003-0003-000000000003'
  ),
  (
    'f1000000-0006-0006-0006-000000000006',
    'You made a strong case for keeping certain teams on a polyrepo setup based on release cadence differences. How do you handle the situation where a monorepo is already in place and the organization is experiencing exactly the CI slowness and codeowner complexity you described, but a full migration back to polyrepo is politically untenable? Are there intermediate architectural moves that give partial relief?',
    'Priya Patel',
    19,
    '2025-10-15 14:38:00',
    'd1000000-0004-0004-0004-000000000004'
  ),
  (
    'f1000000-0007-0007-0007-000000000007',
    'What are the kernel version minimums you''d recommend for running Cilium in production with full eBPF dataplane mode? We''re on a managed Kubernetes offering where we can''t choose the kernel, and the latest available is 5.10. Is that sufficient for the network policy and observability use cases you described, or are there meaningful capabilities we''d be missing relative to 6.x?',
    'Marco Rossi',
    23,
    '2025-10-15 11:41:00',
    'd1000000-0005-0005-0005-000000000005'
  ),
  (
    'f1000000-0008-0008-0008-000000000008',
    'During the workshop setup my Qdrant container keeps OOM-crashing when I load the full document corpus. We''re on a machine with 16GB RAM. Is this expected for the dataset size, or is there a configuration flag I should be setting on the Qdrant collection to use disk-backed storage instead of in-memory vectors?',
    NULL,
    7,
    '2025-10-16 09:52:00',
    'd1000000-0006-0006-0006-000000000006'
  );


-- ============================================================
-- LINKS (speaker social/professional profiles)
-- ============================================================
INSERT INTO link (id, url, type, id_speaker) VALUES
  -- Dr. Evelyn Rhodes
  ('g1000000-0001-0001-0001-000000000001', 'https://evelynrhodes.dev',                                    'website',  'c1000000-0001-0001-0001-000000000001'),
  ('g1000000-0002-0002-0002-000000000002', 'https://github.com/evelynrhodes',                             'github',   'c1000000-0001-0001-0001-000000000001'),
  ('g1000000-0003-0003-0003-000000000003', 'https://linkedin.com/in/evelynrhodes-dist-systems',           'linkedin', 'c1000000-0001-0001-0001-000000000001'),
  ('g1000000-0004-0004-0004-000000000004', 'https://scholar.google.com/citations?user=evelynrhodes',      'scholar',  'c1000000-0001-0001-0001-000000000001'),
  -- Tariq Hassan
  ('g1000000-0005-0005-0005-000000000005', 'https://latencylabs.io/team/tariq',                           'website',  'c1000000-0002-0002-0002-000000000002'),
  ('g1000000-0006-0006-0006-000000000006', 'https://github.com/tariqhassan-rs',                           'github',   'c1000000-0002-0002-0002-000000000002'),
  ('g1000000-0007-0007-0007-000000000007', 'https://boringparts.substack.com',                            'blog',     'c1000000-0002-0002-0002-000000000002'),
  ('g1000000-0008-0008-0008-000000000008', 'https://linkedin.com/in/tariq-hassan-sre',                   'linkedin', 'c1000000-0002-0002-0002-000000000002'),
  -- Yuki Nakamura
  ('g1000000-0009-0009-0009-000000000009', 'https://huggingface.co/yuki-nakamura',                        'website',  'c1000000-0003-0003-0003-000000000003'),
  ('g1000000-0010-0010-0010-000000000010', 'https://github.com/yuki-nk',                                  'github',   'c1000000-0003-0003-0003-000000000003'),
  ('g1000000-0011-0011-0011-000000000011', 'https://yukinakamura.substack.com',                           'blog',     'c1000000-0003-0003-0003-000000000003'),
  -- Marcus Webb
  ('g1000000-0012-0012-0012-000000000012', 'https://youtube.com/@webontheweb',                            'youtube',  'c1000000-0004-0004-0004-000000000004'),
  ('g1000000-0013-0013-0013-000000000013', 'https://github.com/marcuswebb',                               'github',   'c1000000-0004-0004-0004-000000000004'),
  ('g1000000-0014-0014-0014-000000000014', 'https://linkedin.com/in/marcus-webb-devex',                   'linkedin', 'c1000000-0004-0004-0004-000000000004'),
  -- Sofia Andersen
  ('g1000000-0015-0015-0015-000000000015', 'https://sofiaandersen.dev',                                   'website',  'c1000000-0005-0005-0005-000000000005'),
  ('g1000000-0016-0016-0016-000000000016', 'https://github.com/sofia-andersen-cncf',                      'github',   'c1000000-0005-0005-0005-000000000005'),
  ('g1000000-0017-0017-0017-000000000017', 'https://linkedin.com/in/sofia-andersen-k8s',                  'linkedin', 'c1000000-0005-0005-0005-000000000005'),
  ('g1000000-0018-0018-0018-000000000018', 'https://sessionize.com/sofia-andersen',                       'sessionize','c1000000-0005-0005-0005-000000000005');
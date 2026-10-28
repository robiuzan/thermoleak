# Location sources — one register per city page

Every factual statement on a `/locations/{slug}/` page traces to a row in `{slug}.md` here: the field
it sits in, the source URL, the supporting sentence quoted in its original language, and how it was
checked. `lib/locations.ts` points here from its header.

**The rule:** a claim that changes in `lib/locations.ts` changes in its register in the same commit.
A statement with no row is unsourced, and an unsourced statement does not ship (CLAUDE.md golden rule
1, [content-standards.md](../content-standards.md) §6).

| City        | Register                             | Researched and checked |
| ----------- | ------------------------------------ | ---------------------- |
| רמת גן      | [ramat-gan.md](ramat-gan.md)         | 2026-10-28             |
| גבעתיים     | [givatayim.md](givatayim.md)         | 2026-10-28             |
| הרצליה      | [herzliya.md](herzliya.md)           | 2026-10-28             |
| פתח תקווה   | [petah-tikva.md](petah-tikva.md)     | 2026-10-28             |
| ראשון לציון | [rishon-lezion.md](rishon-lezion.md) | 2026-10-28             |
| רעננה       | [raanana.md](raanana.md)             | 2026-10-28             |
| כפר סבא     | [kfar-saba.md](kfar-saba.md)         | 2026-10-28             |
| ראש העין    | [rosh-haayin.md](rosh-haayin.md)     | 2026-10-28             |
| מודיעין     | [modiin.md](modiin.md)               | 2026-10-28             |

**How the nine were checked (2026-10-28).** Each city was researched on its own, and every claim was
put through an attempt to refute it. Each page then had two independent fact-checks: one opened every
cited page and confirmed the quoted sentence on the live page; the other never saw these registers and
tried to disprove each statement from scratch. An editor then read all twelve city pages side by side
for the doorway test (a page that still reads correctly with another city's name does not ship) and
for repeated sentence frames. Statements neither check could confirm were cut or made general.

**Verification is not truth.** These are public sources, not the experience of someone who has worked
in these buildings, and the sentence after each fact — what it means for a leak — is trade reasoning,
not a sourced fact. Every claim still needs the owner's confirmation ([business-facts.md](../business-facts.md) §E).

**The three cities that shipped first have no register.** תל אביב, חולון and בת ים went live on
2026-08-30 from the 2026-08-24 research run, whose source texts were never saved. Their claims were
adversarially checked then; rebuilding their registers is open work.

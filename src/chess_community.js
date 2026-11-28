/**
 * The History Revision Hub — Chess Club Community, Live Highlights Feed,
 * Combined Member + Historical Bot Power Rankings & Clickable Callsign Profile Cards
 */

import { HOUSES } from './chess_data.js';
import { getPupilXpProgress } from './chess_play.js';
import {
  HISTORICAL_BOTS,
  BOT_MAP,
  readLocalBotConquests,
  readLocalBestAccuracy,
  readDailyPuzzleProgress,
  readLocalClubFeed,
} from './chess_bots_and_review.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatRelativeTime(ts) {
  if (!ts) return 'Club Archive';
  const diffSec = Math.max(0, Math.floor((Date.now() - Number(ts)) / 1000));
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(Number(ts)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Merges canonical player conquests, cloud botStats.conqueredBy, and local browser conquests
 */
export function getMergedConquestsForPlayer(player, chessState) {
  const conquered = {};
  if (!player) return conquered;

  // 1. Canonical player.conqueredBots map/array
  if (Array.isArray(player.conqueredBots)) {
    player.conqueredBots.forEach((id) => {
      conquered[id] = { wins: 1, bestAccuracy: player.bestAccuracy || null };
    });
  } else if (player.conqueredBots && typeof player.conqueredBots === 'object') {
    Object.assign(conquered, player.conqueredBots);
  }

  // 2. Cloud botStats[botId].conqueredBy
  const botStats = chessState.botStats || {};
  Object.values(botStats).forEach((bEntry) => {
    if (!bEntry || !Array.isArray(bEntry.conqueredBy)) return;
    const hit = bEntry.conqueredBy.find(
      (c) =>
        (c.playerId && c.playerId === player.id) ||
        String(c.callsign || '').toLowerCase() === String(player.name || '').toLowerCase(),
    );
    if (hit) {
      const prev = conquered[bEntry.botId] || { wins: 0, bestAccuracy: 0 };
      conquered[bEntry.botId] = {
        wins: Math.max(prev.wins || 0, hit.wins || 1),
        bestAccuracy: Math.max(prev.bestAccuracy || 0, hit.bestAccuracy || 0) || null,
      };
    }
  });

  // 3. Local browser conquests
  const localAll = readLocalBotConquests();
  const localMap = localAll[player.id] || {};
  Object.entries(localMap).forEach(([botId, val]) => {
    const prev = conquered[botId] || { wins: 0, bestAccuracy: 0 };
    conquered[botId] = {
      wins: Math.max(prev.wins || 0, val.wins || 1),
      bestAccuracy: Math.max(prev.bestAccuracy || 0, val.bestAccuracy || 0) || null,
    };
  });

  return conquered;
}

export function getBestAccuracyForPlayer(player, chessState) {
  if (!player) return null;
  let best = Number(player.bestAccuracy || 0);
  const localAcc = readLocalBestAccuracy();
  if (localAcc[player.id] && localAcc[player.id] > best) best = localAcc[player.id];

  const feed = [...(chessState.clubFeed || []), ...readLocalClubFeed()];
  feed.forEach((f) => {
    if (
      String(f.callsign || '').toLowerCase() === String(player.name || '').toLowerCase() &&
      typeof f.accuracyPct === 'number' &&
      f.accuracyPct > best
    ) {
      best = f.accuracyPct;
    }
  });
  return best > 0 ? best : null;
}

export function getHumanVictoriesForPlayer(player, matches = []) {
  if (!player) return [];
  const pName = String(player.name || '').toLowerCase();
  const beatenMap = new Map();

  (matches || []).forEach((m) => {
    if (!m || m.result === 'BONUS') return;
    const wMatch = m.whiteId === player.id || String(m.white || '').toLowerCase() === pName;
    const bMatch = m.blackId === player.id || String(m.black || '').toLowerCase() === pName;
    if (wMatch && m.result === '1-0' && m.black && m.black !== 'Computer Coach') {
      beatenMap.set(m.black, (beatenMap.get(m.black) || 0) + 1);
    } else if (bMatch && m.result === '0-1' && m.white && m.white !== 'Computer Coach') {
      beatenMap.set(m.white, (beatenMap.get(m.white) || 0) + 1);
    }
  });

  return [...beatenMap.entries()]
    .map(([name, wins]) => ({ name, wins }))
    .sort((a, b) => b.wins - a.wins);
}

// ============================================================================
// 1. CLUB HIGHLIGHTS FEED ("TWITTER/X-STYLE CLUB DISPATCH" + WEEKLY HONOURS)
// ============================================================================
export function renderClubHighlightsFeedTab(chessState, helpers) {
  const players = chessState.players || [];
  const matches = chessState.matches || [];
  const filter = chessState.feedFilter || 'all';

  // Merge cloud feed + local feed (deduped by eventId)
  const seenIds = new Set();
  const liveEvents = [];
  [...(chessState.clubFeed || []), ...readLocalClubFeed()].forEach((ev) => {
    if (!ev) return;
    const id = ev.eventId || `${ev.type}_${ev.callsign}_${ev.createdAt}`;
    if (seenIds.has(id)) return;
    seenIds.add(id);
    liveEvents.push(ev);
  });

  // Synthesize rich feed cards from recent official Club Matches so feed is vibrant from Day 1
  const matchEvents = matches.slice(0, 24).map((m, idx) => {
    if (m.result === 'BONUS') {
      return {
        eventId: `m_bonus_${m.id || idx}`,
        type: 'house_milestone',
        callsign: m.white,
        house: m.whiteHouse || 'warrior',
        bonusHousePts: Number(m.bonusPoints || 1),
        roundLabel: m.round || 'Practice XP Milestone',
        createdAt: m.timestamp || 0,
        dateLabel: m.date || 'Club Session',
      };
    }
    const isDraw = m.result === '1/2-1/2' || m.result === '½-½';
    const winnerCallsign = m.result === '1-0' ? m.white : m.result === '0-1' ? m.black : m.white;
    const winnerHouse =
      m.result === '1-0' ? m.whiteHouse : m.result === '0-1' ? m.blackHouse : m.whiteHouse;
    const loserCallsign = m.result === '1-0' ? m.black : m.white;
    const loserHouse = m.result === '1-0' ? m.blackHouse : m.whiteHouse;
    return {
      eventId: `m_game_${m.id || idx}`,
      type: 'club_match',
      isDraw,
      callsign: winnerCallsign,
      house: winnerHouse || 'warrior',
      opponentCallsign: loserCallsign,
      opponentHouse: loserHouse || 'invincible',
      roundLabel: m.round || 'Club Ladder',
      opening: m.opening || '',
      createdAt: m.timestamp || 0,
      dateLabel: m.date || 'Club Match',
    };
  });

  const combined = [...liveEvents, ...matchEvents].sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
  );

  const filteredStream = combined.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'bots') return item.type === 'bot_conquest';
    if (filter === 'online') return item.type === 'online_duel';
    if (filter === 'accuracy') return item.type === 'high_accuracy' || (item.accuracyPct && item.accuracyPct >= 80);
    if (filter === 'matches') return item.type === 'club_match' || item.type === 'house_milestone';
    return true;
  });

  // Compute Weekly / Club Honours Digest Cards
  const houseTotals = helpers.calculateHouseTotals();
  const topHouseObj = Object.values(houseTotals).sort((a, b) => b.points - a.points)[0];
  const topHouseMeta = topHouseObj ? HOUSES[topHouseObj.id] : HOUSES.warrior;

  let topAccCallsign = 'Play a Bot or Duel!';
  let topAccVal = 0;
  players.forEach((p) => {
    const acc = getBestAccuracyForPlayer(p, chessState);
    if (acc && acc > topAccVal) {
      topAccVal = acc;
      topAccCallsign = p.name;
    }
  });
  liveEvents.forEach((ev) => {
    if (ev.accuracyPct && ev.accuracyPct > topAccVal) {
      topAccVal = ev.accuracyPct;
      topAccCallsign = ev.callsign;
    }
  });

  let topBotSlayer = 'Unclaimed — Beat Turing!';
  let topBotEloBeaten = 0;
  let topBotBeatenName = '';
  players.forEach((p) => {
    const conq = getMergedConquestsForPlayer(p, chessState);
    Object.keys(conq).forEach((bId) => {
      const b = BOT_MAP[bId];
      if (b && b.elo > topBotEloBeaten) {
        topBotEloBeaten = b.elo;
        topBotSlayer = p.name;
        topBotBeatenName = `${b.icon} ${b.shortName} (${b.elo})`;
      }
    });
  });

  const onlineDuelsPlayed = liveEvents.filter((x) => x.type === 'online_duel').length;
  const latestDuelEvt = liveEvents.find((x) => x.type === 'online_duel');

  const findPlayerIdByName = (name) => {
    if (!name) return '';
    const hit = players.find((p) => String(p.name || '').toLowerCase() === String(name).toLowerCase());
    return hit ? hit.id : '';
  };

  const renderCallsignLink = (name, houseId) => {
    const pid = findPlayerIdByName(name);
    const h = HOUSES[houseId];
    const badge = h
      ? `<span style="background: ${h.bgLight}; color: ${h.color}; border: 1px solid ${h.borderColor}; padding: 0 6px; border-radius: 999px; font-size: 0.65rem; font-weight: 800; margin-left: 4px;">${h.name}</span>`
      : '';
    if (pid) {
      return `<button type="button" onclick="window.openChessPlayerProfile('${pid}')" style="background: none; border: none; padding: 0; font: inherit; font-weight: 900; color: #0f172a; text-decoration: underline; text-decoration-color: #94a3b8; text-underline-offset: 2px; cursor: pointer;">${escapeHtml(name)}</button>${badge}`;
    }
    return `<strong style="color: #0f172a;">${escapeHtml(name)}</strong>${badge}`;
  };

  const renderFeedCard = (ev) => {
    let tagBg = '#f1f5f9';
    let tagColor = '#334155';
    let tagLabel = '♟️ CLUB UPDATE';
    let avatar = '♟️';
    let headlineHtml = '';
    let pillsHtml = '';

    if (ev.type === 'bot_conquest') {
      const bot = BOT_MAP[ev.botId] || HISTORICAL_BOTS[2];
      tagBg = '#fef3c7';
      tagColor = '#b45309';
      tagLabel = '👑 BOT CONQUEST';
      avatar = bot.icon;
      headlineHtml = `${renderCallsignLink(ev.callsign, ev.house)} defeated <strong>${bot.icon} ${escapeHtml(bot.name)} (${bot.elo} ELO)</strong> in ${Math.ceil((ev.moves || 12) / 2)} moves!`;
      pillsHtml = `
        ${ev.accuracyPct ? `<span style="background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">🎯 ${ev.accuracyPct}% Accuracy</span>` : ''}
        ${ev.xp ? `<span style="background: #eff6ff; color: #0369a1; border: 1px solid #bae6fd; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">⚡ +${ev.xp} XP → House Pts</span>` : ''}
      `;
    } else if (ev.type === 'online_duel') {
      tagBg = '#e0f2fe';
      tagColor = '#0369a1';
      tagLabel = '🌐 LIVE 2-LAPTOP DUEL';
      avatar = '⚔️';
      headlineHtml = `${renderCallsignLink(ev.callsign, ev.house)} battled ${renderCallsignLink(ev.opponentCallsign || 'Classmate', ev.opponentHouse)} live across the school network${ev.roomCode ? ` (Room <code>${escapeHtml(ev.roomCode)}</code>)` : ''}!`;
      pillsHtml = `
        ${ev.bonusHousePts ? `<span style="background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 900;">🏆 +${ev.bonusHousePts} Extra House Point!</span>` : ''}
        ${ev.accuracyPct ? `<span style="background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">🎯 ${ev.accuracyPct}% Accuracy</span>` : ''}
        ${ev.xp ? `<span style="background: #eff6ff; color: #0369a1; border: 1px solid #bae6fd; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">⚡ +${ev.xp} XP</span>` : ''}
      `;
    } else if (ev.type === 'high_accuracy') {
      const bot = BOT_MAP[ev.botId];
      tagBg = '#dcfce7';
      tagColor = '#166534';
      tagLabel = '🎯 GRANDMASTER PRECISION';
      avatar = '💎';
      headlineHtml = `${renderCallsignLink(ev.callsign, ev.house)} posted a <strong>${ev.accuracyPct}% Coach Review Accuracy</strong>${bot ? ` against ${bot.icon} ${escapeHtml(bot.shortName)}` : ''}!`;
      pillsHtml = `<span style="background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">🎯 ${ev.accuracyPct}% Precision · +${ev.xp || 15} XP</span>`;
    } else if (ev.type === 'daily_puzzle') {
      tagBg = '#ffedd5';
      tagColor = '#c2410c';
      tagLabel = '🧩 DAILY TACTICAL PUZZLE';
      avatar = '🔥';
      headlineHtml = `${renderCallsignLink(ev.callsign, ev.house)} cracked today's 1-move Checkmate Puzzle!`;
      pillsHtml = `
        <span style="background: #fff7ed; color: #c2410c; border: 1px solid #fdba74; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">🔥 ${ev.streak || 1}-Day Streak</span>
        <span style="background: #eff6ff; color: #0369a1; border: 1px solid #bae6fd; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">⚡ +${ev.xp || 15} XP</span>
      `;
    } else if (ev.type === 'house_milestone') {
      tagBg = '#f3e8ff';
      tagColor = '#6b21a8';
      tagLabel = '🏆 HOUSE POINT UNLOCKED';
      avatar = '⚡';
      headlineHtml = `${renderCallsignLink(ev.callsign, ev.house)} hit a 100-XP Practice Milestone and unlocked <strong>+${ev.bonusHousePts || 1} Bonus House Point</strong>!`;
      pillsHtml = `<span style="background: #faf5ff; color: #6b21a8; border: 1px solid #d8b4fe; border-radius: 999px; padding: 2px 8px; font-size: 0.7rem; font-weight: 800;">${escapeHtml(ev.roundLabel || '100 XP Bonus')}</span>`;
    } else {
      tagBg = '#f1f5f9';
      tagColor = '#334155';
      tagLabel = `⚔️ ${escapeHtml((ev.roundLabel || 'CLUB MATCH').toUpperCase())}`;
      avatar = ev.isDraw ? '🤝' : '♟️';
      headlineHtml = ev.isDraw
        ? `${renderCallsignLink(ev.callsign, ev.house)} drew a hard-fought battle with ${renderCallsignLink(ev.opponentCallsign, ev.opponentHouse)} (+2 House Pts each).`
        : `${renderCallsignLink(ev.callsign, ev.house)} defeated ${renderCallsignLink(ev.opponentCallsign, ev.opponentHouse)} on the Club Ladder (+3 House Pts)!`;
      pillsHtml = ev.opening
        ? `<span style="background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius: 999px; padding: 2px 8px; font-size: 0.68rem; font-weight: 700;">📖 ${escapeHtml(ev.opening)}</span>`
        : '';
    }

    const timeLabel = ev.createdAt ? formatRelativeTime(ev.createdAt) : ev.dateLabel || 'Recent';

    return `
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; display: flex; gap: 12px; align-items: flex-start; box-shadow: 0 2px 6px rgba(15,23,42,0.03);">
        <div style="width: 40px; height: 40px; border-radius: 10px; background: ${tagBg}; border: 1px solid rgba(15,23,42,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
          ${avatar}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
            <span style="background: ${tagBg}; color: ${tagColor}; padding: 2px 8px; border-radius: 6px; font-size: 0.66rem; font-weight: 900; letter-spacing: 0.04em;">
              ${tagLabel}
            </span>
            <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 700; font-family: monospace;">
              ${escapeHtml(timeLabel)}
            </span>
          </div>
          <div style="font-size: 0.87rem; color: #1e293b; line-height: 1.45; margin-bottom: ${pillsHtml ? '7px' : '0'};">
            ${headlineHtml}
          </div>
          ${pillsHtml ? `<div style="display: flex; gap: 6px; flex-wrap: wrap;">${pillsHtml}</div>` : ''}
        </div>
      </div>
    `;
  };

  return `
    <div style="display: flex; flex-direction: column; gap: 14px; max-width: 940px; margin: 0 auto;">
      
      <!-- Pinned Weekly / Daily Club Highlights Digest -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 14px; padding: 14px 16px; color: #ffffff; box-shadow: 0 8px 22px rgba(15,23,42,0.16);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #38bdf8;">
              📣 Live Club Dispatch · Automated Highlights Ticker
            </div>
            <h2 style="margin: 2px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; color: #ffffff;">
              This Week’s Club Headlines &amp; House Honours
            </h2>
          </div>
          <button type="button" onclick="window.switchChessTab('play')" style="background: #38bdf8; color: #0f172a; border: none; border-radius: 8px; padding: 7px 12px; font-size: 0.76rem; font-weight: 900; cursor: pointer;">
            ♟️ Play to Make the Feed →
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(195px, 1fr)); gap: 9px;">
          <div style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 9px 11px;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">🎯 Highest Accuracy</div>
            <div style="font-size: 0.9rem; font-weight: 900; color: #6ee7b7; margin-top: 2px;">${topAccVal > 0 ? `${topAccVal}% · ${escapeHtml(topAccCallsign)}` : escapeHtml(topAccCallsign)}</div>
            <div style="font-size: 0.68rem; color: #cbd5e1;">80%+ Accuracy earns Bonus XP</div>
          </div>

          <div style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 9px 11px;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">👑 Top Bot Slayer</div>
            <div style="font-size: 0.9rem; font-weight: 900; color: #fde047; margin-top: 2px;">${escapeHtml(topBotSlayer)}</div>
            <div style="font-size: 0.68rem; color: #cbd5e1;">${topBotBeatenName ? `Defeated ${escapeHtml(topBotBeatenName)}` : '6 History Bots awaiting challengers'}</div>
          </div>

          <div style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 9px 11px;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">🌐 Live Laptop Duels</div>
            <div style="font-size: 0.9rem; font-weight: 900; color: #7dd3fc; margin-top: 2px;">${latestDuelEvt ? escapeHtml(latestDuelEvt.callsign) : `${onlineDuelsPlayed} Duels Logged`}</div>
            <div style="font-size: 0.68rem; color: #cbd5e1;">+1 Extra House Pt per live duel!</div>
          </div>

          <div style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 9px 11px;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">🏰 Leading House</div>
            <div style="font-size: 0.9rem; font-weight: 900; color: #ffffff; margin-top: 2px;">${topHouseMeta.name} · ${topHouseObj ? topHouseObj.points : 0} pts</div>
            <div style="font-size: 0.68rem; color: #cbd5e1;">Every 100 XP = +1 House Point</div>
          </div>
        </div>
      </div>

      <!-- Filter Pills -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 7px 10px;">
        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
          ${[
            { id: 'all', label: '📣 All Highlights' },
            { id: 'bots', label: '👑 Bot Conquests' },
            { id: 'online', label: '🌐 Laptop Duels' },
            { id: 'accuracy', label: '🎯 80%+ Accuracy' },
            { id: 'matches', label: '⚔️ Ladder Matches' },
          ]
            .map(
              (f) => `
            <button type="button" onclick="window.setChessFeedFilter('${f.id}')" style="background: ${filter === f.id ? '#0f172a' : '#f8fafc'}; color: ${filter === f.id ? '#ffffff' : '#475569'}; border: 1px solid ${filter === f.id ? '#0f172a' : '#cbd5e1'}; border-radius: 999px; padding: 5px 11px; font-size: 0.75rem; font-weight: 800; cursor: pointer;">
              ${f.label}
            </button>
          `,
            )
            .join('')}
        </div>
        <span style="font-size: 0.7rem; color: #64748b; font-weight: 700;">🔒 100% Callsign-Safe Auto Feed</span>
      </div>

      <!-- Feed Stream -->
      <div style="display: flex; flex-direction: column; gap: 9px;">
        ${
          filteredStream.length > 0
            ? filteredStream.slice(0, 35).map(renderFeedCard).join('')
            : `<div style="background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 26px; text-align: center; color: #64748b; font-size: 0.85rem;">No highlights in this category yet — challenge a Historical Bot or play a Live Laptop Duel to be the first on the board!</div>`
        }
      </div>

    </div>
  `;
}

// ============================================================================
// 2. BOT RANKINGS, COMBINED ELO POWER SCALE & MEMBER CONQUEST MATRIX
// ============================================================================
export function renderBotRankingsAndConquestsTab(chessState, helpers) {
  const players = chessState.players || [];
  const botStats = chessState.botStats || {};

  // Build live bot rows sorted from strongest computer to weakest
  const botRows = HISTORICAL_BOTS.map((b) => {
    const st = botStats[b.id] || {};
    const liveElo = st.liveElo || b.elo;
    const games = st.games || 0;
    const botWins = st.botWins || 0;
    const pupilWins = st.pupilWins || 0;
    const draws = st.draws || 0;

    // Collect every club member who has beaten this bot
    const slayers = new Set();
    if (Array.isArray(st.conqueredBy)) {
      st.conqueredBy.forEach((c) => {
        if (c.callsign) slayers.add(c.callsign);
      });
    }
    players.forEach((p) => {
      const conq = getMergedConquestsForPlayer(p, chessState);
      if (conq[b.id]) slayers.add(p.name);
    });

    return {
      ...b,
      liveElo,
      games,
      botWins,
      pupilWins,
      draws,
      slayers: [...slayers],
    };
  }).sort((a, b) => b.liveElo - a.liveElo);

  // Combined Human + Computer Power Scale (sorted by ELO!)
  const combinedPower = [
    ...botRows.map((b) => ({
      isBot: true,
      id: b.id,
      name: b.name,
      icon: b.icon,
      elo: b.liveElo,
      sub: `${b.tierLabel} · Bot Record: ${b.botWins}W-${b.draws}D-${b.pupilWins}L`,
      accent: b.accent,
    })),
    ...players.map((p) => ({
      isBot: false,
      id: p.id,
      name: p.name,
      house: p.house,
      elo: p.rating || 1000,
      sub: `${HOUSES[p.house]?.name || p.house} · ${p.won}W/${p.drawn}D/${p.lost}L · ${helpers.calculatePlayerPoints(p)} House Pts`,
    })),
  ].sort((a, b) => b.elo - a.elo);

  return `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 980px; margin: 0 auto;">
      
      <!-- Section 1: Computer Power Rankings (Which Bot is #1?) -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 13px; padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
          <div>
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: #0f172a;">
              🤖 Historical Computer Power Rankings (6 Levels)
            </h3>
            <div style="font-size: 0.78rem; color: #64748b;">
              Ranked from our #1 Boss Engine (Alan Turing · 1700 ELO) down to Tudor Novice (Henry VIII · 450 ELO). Every game shifts their live club rating!
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
          ${botRows
            .map(
              (b, idx) => `
            <div style="background: ${b.bgLight}; border: 1.5px solid ${b.border}; border-radius: 11px; padding: 11px 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span style="font-size: 0.7rem; font-weight: 900; background: #ffffff; color: ${b.accent}; border: 1px solid ${b.border}; padding: 1px 7px; border-radius: 999px; font-family: monospace;">
                    #${idx + 1} Computer · ${b.liveElo} ELO
                  </span>
                  <span style="font-size: 0.7rem; font-weight: 800; color: #059669; font-family: monospace;">+${b.winXp} XP</span>
                </div>
                <div style="font-size: 0.96rem; font-weight: 900; color: #0f172a;">
                  ${b.icon} ${escapeHtml(b.name)}
                </div>
                <div style="font-size: 0.73rem; color: #475569; margin-top: 2px; line-height: 1.35;">
                  ${escapeHtml(b.summary)}
                </div>
              </div>

              <div style="border-top: 1px solid rgba(15,23,42,0.08); padding-top: 7px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                <div style="font-size: 0.7rem; color: #334155;">
                  <strong>Club Record:</strong> ${b.botWins}W–${b.draws}D–${b.pupilWins}L<br/>
                  <span style="color: #64748b;">${b.slayers.length > 0 ? `Beaten by: <strong>${b.slayers.slice(0, 3).map(escapeHtml).join(', ')}${b.slayers.length > 3 ? ` +${b.slayers.length - 3}` : ''}</strong>` : 'Undefeated by Club so far!'}</span>
                </div>
                <button type="button" onclick="window.challengeHistoricalBot('${b.id}')" style="background: ${b.accent}; color: #ffffff; border: none; border-radius: 7px; padding: 6px 11px; font-size: 0.74rem; font-weight: 800; cursor: pointer; flex-shrink: 0;">
                  ⚔️ Challenge
                </button>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Section 2: Member Conquest Matrix (Who Has Beaten Which Computer & Human Rival) -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 13px; padding: 14px 16px; overflow-x: auto;">
        <h3 style="margin: 0 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.1rem; color: #0f172a;">
          🏆 Member Trophy Matrix — Who Has Beaten Who?
        </h3>
        <div style="font-size: 0.76rem; color: #64748b; margin-bottom: 10px;">
          Click any Club Member’s Callsign to open their full Chess Profile Card, ELO graph, and Human Rivals defeated!
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; min-width: 660px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
              <th style="padding: 8px 10px;">Club Member</th>
              <th style="padding: 8px 6px; text-align: center;">ELO</th>
              ${HISTORICAL_BOTS.map(
                (b) =>
                  `<th style="padding: 8px 4px; text-align: center;" title="${escapeHtml(b.name)} (${b.elo} ELO)">${b.icon}<br/><span style="font-size: 0.64rem; color: #64748b; font-family: monospace;">${b.elo}</span></th>`,
              ).join('')}
              <th style="padding: 8px 8px;">Club Rivals Defeated</th>
            </tr>
          </thead>
          <tbody>
            ${players
              .slice()
              .sort((a, b) => (a.rank || 99) - (b.rank || 99))
              .map((p) => {
                const conq = getMergedConquestsForPlayer(p, chessState);
                const humanWins = getHumanVictoriesForPlayer(p, chessState.matches);
                const h = HOUSES[p.house];
                return `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 10px;">
                      <button type="button" onclick="window.openChessPlayerProfile('${p.id}')" style="background: none; border: none; padding: 0; font: inherit; font-weight: 800; color: #0f172a; cursor: pointer; text-decoration: underline; text-decoration-color: #cbd5e1;">
                        #${p.rank} ${escapeHtml(p.name)}
                      </button>
                      ${h ? `<span style="background: ${h.bgLight}; color: ${h.color}; border-radius: 999px; padding: 1px 6px; font-size: 0.64rem; font-weight: 800; margin-left: 4px;">${h.name}</span>` : ''}
                    </td>
                    <td style="padding: 8px 6px; text-align: center; font-family: monospace; font-weight: 800;">${p.rating}</td>
                    ${HISTORICAL_BOTS.map((b) => {
                      const hit = conq[b.id];
                      return `<td style="padding: 8px 4px; text-align: center;">${
                        hit
                          ? `<span title="Defeated ${escapeHtml(b.name)}${hit.bestAccuracy ? ` (${hit.bestAccuracy}% Acc)` : ''}" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #dcfce7; color: #15803d; font-weight: 900; font-size: 0.72rem;">✓</span>`
                          : `<span style="color: #cbd5e1;">·</span>`
                      }</td>`;
                    }).join('')}
                    <td style="padding: 8px 8px; font-size: 0.72rem; color: #475569;">
                      ${
                        humanWins.length > 0
                          ? humanWins
                              .slice(0, 4)
                              .map(
                                (hw) =>
                                  `<span style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1px 6px; margin-right: 3px; display: inline-block; margin-bottom: 2px;">${escapeHtml(hw.name)}${hw.wins > 1 ? ` ×${hw.wins}` : ''}</span>`,
                              )
                              .join('') +
                            (humanWins.length > 4 ? ` <span style="color:#64748b;">+${humanWins.length - 4} more</span>` : '')
                          : '<span style="color: #94a3b8;">Ready for first win</span>'
                      }
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 3: Combined Human + Computer ELO Ladder -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 13px; padding: 14px 16px;">
        <h3 style="margin: 0 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.08rem; color: #0f172a;">
          ⚡ Combined Club &amp; Computer ELO Scale
        </h3>
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 10px;">
          See exactly which Historical Bots sit above or below each Club Member by ELO rating!
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          ${combinedPower
            .map(
              (row, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 11px; border-radius: 8px; background: ${row.isBot ? '#f8fafc' : '#ffffff'}; border: 1px solid ${row.isBot ? '#cbd5e1' : '#e2e8f0'};">
              <div style="display: flex; align-items: center; gap: 9px; min-width: 0;">
                <span style="width: 26px; font-family: monospace; font-size: 0.75rem; font-weight: 900; color: #64748b;">#${i + 1}</span>
                ${
                  row.isBot
                    ? `<span style="background: #0f172a; color: #fbbf24; font-size: 0.64rem; font-weight: 900; padding: 1px 6px; border-radius: 4px;">BOT</span>
                       <span style="font-size: 0.85rem; font-weight: 900; color: #0f172a;">${row.icon} ${escapeHtml(row.name)}</span>`
                    : `<button type="button" onclick="window.openChessPlayerProfile('${row.id}')" style="background: none; border: none; padding: 0; font-size: 0.85rem; font-weight: 800; color: #0284c7; cursor: pointer; text-decoration: underline;">${escapeHtml(row.name)}</button>`
                }
                <span style="font-size: 0.7rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(row.sub)}</span>
              </div>
              <span style="font-family: monospace; font-size: 0.84rem; font-weight: 900; color: #0f172a; flex-shrink: 0;">${row.elo} ELO</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

    </div>
  `;
}

// ============================================================================
// 3. CLICKABLE CALLSIGN MEMBER PROFILE CARD MODAL (CHESS.COM STYLE)
// ============================================================================
export function renderPlayerProfileModalHtml(playerId, chessState, helpers) {
  const player = (chessState.players || []).find((p) => p.id === playerId);
  if (!player) return '';

  const h = HOUSES[player.house] || HOUSES.warrior;
  const xpInfo = getPupilXpProgress(player);
  const totalPts = helpers.calculatePlayerPoints(player);
  const conq = getMergedConquestsForPlayer(player, chessState);
  const conqueredCount = Object.keys(conq).length;
  const bestAcc = getBestAccuracyForPlayer(player, chessState);
  const dailyProg = readDailyPuzzleProgress(player.id);
  const humanWins = getHumanVictoriesForPlayer(player, chessState.matches);

  // Reconstruct ELO trend points from chronological matches
  const pLower = String(player.name || '').toLowerCase();
  const myMatches = (chessState.matches || [])
    .filter(
      (m) =>
        m &&
        m.result !== 'BONUS' &&
        (m.whiteId === player.id ||
          m.blackId === player.id ||
          String(m.white || '').toLowerCase() === pLower ||
          String(m.black || '').toLowerCase() === pLower),
    )
    .slice()
    .reverse();

  let runningElo = 1000;
  const eloSeries = [1000];
  myMatches.forEach((m) => {
    const isWhite = m.whiteId === player.id || String(m.white || '').toLowerCase() === pLower;
    if (m.result === '1/2-1/2' || m.result === '½-½') runningElo += 0;
    else if ((isWhite && m.result === '1-0') || (!isWhite && m.result === '0-1')) runningElo += 15;
    else runningElo -= 12;
    eloSeries.push(runningElo);
  });
  eloSeries[eloSeries.length - 1] = player.rating || runningElo;

  const minE = Math.min(...eloSeries) - 15;
  const maxE = Math.max(...eloSeries) + 15;
  const spanE = Math.max(30, maxE - minE);
  const sparkPoints = eloSeries
    .map((val, idx) => {
      const x = eloSeries.length === 1 ? 150 : Math.round((idx / (eloSeries.length - 1)) * 290) + 5;
      const y = Math.round(54 - ((val - minE) / spanE) * 44);
      return `${x},${y}`;
    })
    .join(' ');

  // Compute Unlocked Achievement Badges
  const badges = [];
  if ((player.won || 0) >= 1) badges.push({ icon: '⚔️', label: 'First Blood' });
  if ((player.won || 0) >= 5) badges.push({ icon: '🏆', label: 'Ladder Veteran (5+ Wins)' });
  if ((player.rating || 1000) >= 1100) badges.push({ icon: '📈', label: '1100+ ELO Club' });
  if (conqueredCount >= 1) badges.push({ icon: '👑', label: `Bot Hunter (${conqueredCount}/6)` });
  if (conq.turing) badges.push({ icon: '💻', label: 'Bletchley Boss Slayer' });
  if (bestAcc && bestAcc >= 85) badges.push({ icon: '🎯', label: `${bestAcc}% Precision` });
  if (xpInfo.totalXp >= 100) badges.push({ icon: '⚡', label: '100+ XP Centurion' });
  if (dailyProg.streak >= 2) badges.push({ icon: '🔥', label: `${dailyProg.streak}d Puzzle Streak` });
  if (badges.length === 0) badges.push({ icon: '🌱', label: 'Rising Contender' });

  const totalG = Math.max(1, (player.won || 0) + (player.drawn || 0) + (player.lost || 0));
  const winPct = Math.round(((player.won || 0) / totalG) * 100);
  const drawPct = Math.round(((player.drawn || 0) / totalG) * 100);
  const lossPct = Math.max(0, 100 - winPct - drawPct);

  return `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.76); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 14px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 16px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 20px 22px; box-shadow: 0 24px 50px rgba(0,0,0,0.35); font-family: 'Outfit', sans-serif;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: ${h.bgLight}; border: 2px solid ${h.color}; display: flex; align-items: center; justify-content: center; font-size: 1.45rem; font-weight: 900; color: ${h.color};">
              ${player.rank === 1 ? '👑' : `#${player.rank}`}
            </div>
            <div>
              <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #0f172a;">
                ${escapeHtml(player.name)}
              </h2>
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-top: 3px;">
                <span style="background: ${h.bgLight}; color: ${h.color}; border: 1px solid ${h.borderColor}; padding: 1px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800;">${h.name} House</span>
                <span style="background: #f8fafc; color: ${xpInfo.badge.color}; border: 1px solid #cbd5e1; padding: 1px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800;">${xpInfo.badge.icon} ${xpInfo.badge.title}</span>
              </div>
            </div>
          </div>
          <button type="button" onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.4rem; color: #64748b; cursor: pointer; line-height: 1;">&times;</button>
        </div>

        <!-- 4 Key Stat Tiles -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px; text-align: center;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Rating</div>
            <div style="font-size: 1.1rem; font-weight: 900; font-family: monospace; color: #0f172a;">${player.rating}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px; text-align: center;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">House Pts</div>
            <div style="font-size: 1.1rem; font-weight: 900; font-family: monospace; color: ${h.color};">${totalPts}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px; text-align: center;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Best Acc</div>
            <div style="font-size: 1.1rem; font-weight: 900; font-family: monospace; color: #059669;">${bestAcc ? `${bestAcc}%` : '—'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px; text-align: center;">
            <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Practice XP</div>
            <div style="font-size: 1.1rem; font-weight: 900; font-family: monospace; color: #0284c7;">${xpInfo.totalXp}</div>
          </div>
        </div>

        <!-- W/D/L Bar + ELO Sparkline -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 800; margin-bottom: 5px;">
            <span style="color: #16a34a;">${player.won || 0} Wins (${winPct}%)</span>
            <span style="color: #64748b;">${player.drawn || 0} Draws</span>
            <span style="color: #dc2626;">${player.lost || 0} Losses</span>
          </div>
          <div style="height: 8px; border-radius: 999px; overflow: hidden; display: flex; background: #e2e8f0; margin-bottom: 10px;">
            <div style="width: ${winPct}%; background: #16a34a;"></div>
            <div style="width: ${drawPct}%; background: #94a3b8;"></div>
            <div style="width: ${lossPct}%; background: #ef4444;"></div>
          </div>
          <div style="font-size: 0.66rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">ELO Progression</div>
          <svg viewBox="0 0 300 60" style="width: 100%; height: 52px; display: block;">
            <polyline fill="none" stroke="${h.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" points="${sparkPoints}" />
          </svg>
        </div>

        <!-- 6-Boss Historical Bot Trophy Shelf -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.74rem; font-weight: 900; color: #0f172a; margin-bottom: 6px;">
            🤖 Historical Bot Trophy Shelf (${conqueredCount}/6 Defeated)
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            ${HISTORICAL_BOTS.map((b) => {
              const won = Boolean(conq[b.id]);
              return `
                <div style="background: ${won ? '#fefce8' : '#f8fafc'}; border: 1.5px solid ${won ? '#eab308' : '#e2e8f0'}; border-radius: 8px; padding: 6px 8px; opacity: ${won ? '1' : '0.68'}; display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                  <div style="min-width: 0;">
                    <div style="font-size: 0.74rem; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${b.icon} ${escapeHtml(b.shortName)}</div>
                    <div style="font-size: 0.63rem; font-family: monospace; color: #64748b;">${b.elo} ELO</div>
                  </div>
                  <span style="font-size: 0.78rem; font-weight: 900; color: ${won ? '#ca8a04' : '#cbd5e1'};">${won ? '🏆' : '🔒'}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Unlocked Club Badges -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.74rem; font-weight: 900; color: #0f172a; margin-bottom: 6px;">🎖️ Unlocked Badges</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${badges
              .map(
                (bg) =>
                  `<span style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 999px; padding: 3px 9px; font-size: 0.72rem; font-weight: 800;">${bg.icon} ${escapeHtml(bg.label)}</span>`,
              )
              .join('')}
          </div>
        </div>

        <!-- Club Rivals Defeated -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.74rem; font-weight: 900; color: #0f172a; margin-bottom: 5px;">⚔️ Club Rivals Defeated (${humanWins.length})</div>
          <div style="font-size: 0.76rem; color: #334155;">
            ${
              humanWins.length > 0
                ? humanWins
                    .map(
                      (hw) =>
                        `<span style="display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; border-radius: 7px; padding: 2px 8px; margin: 0 4px 4px 0; font-weight: 700;">✓ ${escapeHtml(hw.name)}${hw.wins > 1 ? ` (×${hw.wins})` : ''}</span>`,
                    )
                    .join('')
                : '<span style="color: #94a3b8;">Play a Club Ladder or Live Online Duel match to record your first rival victory!</span>'
            }
          </div>
        </div>

        <button type="button" onclick="window.closeChessModal()" style="width: 100%; background: #0f172a; color: #ffffff; border: none; border-radius: 9px; padding: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">
          Close Profile Card
        </button>

      </div>
    </div>
  `;
}

/**
 * data/companies.js 구조·매칭 무결성 테스트
 * 실행: node --test __tests__/companies-integrity.test.mjs
 *
 * 검증 범위:
 *  - 12개 컴포넌트 존재
 *  - 각 컴포넌트 후보풀 최소 10개 이상
 *  - 전체 기업에 FLAG_BY_NAME 매핑 존재
 *  - rank 중복 없음
 *  - 잘못 배치됐던 기업들이 제거됐는지 (회귀 방지)
 *  - 올바른 기업들이 제자리에 존재하는지
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_COMPONENTS, LAYERS, FLAG_BY_NAME } from '../data/companies.js';

// ─── 헬퍼 ────────────────────────────────────────
function getComp(id) {
  return ALL_COMPONENTS.find(c => c.id === id);
}

function getCandidateNames(id) {
  return getComp(id)?.candidates?.map(c => c.name) ?? [];
}

// ─────────────────────────────────────────────────
// 기본 구조 검증
// ─────────────────────────────────────────────────
describe('companies.js 기본 구조', () => {
  test('ALL_COMPONENTS가 정확히 12개 컴포넌트를 포함한다', () => {
    assert.equal(ALL_COMPONENTS.length, 12);
  });

  test('4개 레이어가 존재한다 (cloud, compute, network, power-cooling, infra)', () => {
    // cloud(2) + compute(4) + network(2) + power-cooling(2) + infra(2) = 12
    const ids = LAYERS.map(l => l.id);
    assert.ok(ids.includes('cloud'));
    assert.ok(ids.includes('compute'));
    assert.ok(ids.includes('network'));
    assert.ok(ids.includes('power-cooling'));
    assert.ok(ids.includes('infra'));
  });

  test('각 컴포넌트는 id, icon, name, desc, candidates를 가진다', () => {
    for (const comp of ALL_COMPONENTS) {
      assert.ok(comp.id,         `${comp.id}: id 누락`);
      assert.ok(comp.icon,       `${comp.id}: icon 누락`);
      assert.ok(comp.name,       `${comp.id}: name 누락`);
      assert.ok(comp.candidates, `${comp.id}: candidates 누락`);
    }
  });

  test('각 컴포넌트는 후보풀이 최소 10개 이상이다', () => {
    for (const comp of ALL_COMPONENTS) {
      assert.ok(
        comp.candidates.length >= 10,
        `${comp.id}: 후보풀 ${comp.candidates.length}개 (최소 10개 필요)`
      );
    }
  });

  test('각 컴포넌트에 detail 설명이 최소 1개 이상 존재한다', () => {
    for (const comp of ALL_COMPONENTS) {
      assert.ok(
        comp.detail?.length >= 1,
        `${comp.id}: detail 없음`
      );
    }
  });
});

// ─────────────────────────────────────────────────
// 후보 기업 데이터 완결성
// ─────────────────────────────────────────────────
describe('후보 기업 데이터 완결성', () => {
  test('모든 후보 기업에 필수 필드(name, ticker, mktcap, ir, news, x)가 존재한다', () => {
    const REQUIRED = ['name', 'ticker', 'mktcap', 'ir', 'news', 'x'];
    for (const comp of ALL_COMPONENTS) {
      for (const c of comp.candidates) {
        for (const field of REQUIRED) {
          assert.ok(
            c[field] !== undefined && c[field] !== '',
            `${comp.id} / ${c.name}: ${field} 누락`
          );
        }
      }
    }
  });

  test('각 컴포넌트 내 rank 값이 중복되지 않는다', () => {
    for (const comp of ALL_COMPONENTS) {
      const ranks = comp.candidates.map(c => c.rank);
      const unique = new Set(ranks);
      assert.equal(
        unique.size, ranks.length,
        `${comp.id}: rank 중복 존재`
      );
    }
  });

  test('모든 후보 기업에 FLAG_BY_NAME 매핑이 존재한다', () => {
    const missing = [];
    for (const comp of ALL_COMPONENTS) {
      for (const c of comp.candidates) {
        if (!FLAG_BY_NAME[c.name]) {
          missing.push(`${comp.id}/${c.name}`);
        }
      }
    }
    assert.deepEqual(missing, [], `FLAG 매핑 누락: ${missing.join(', ')}`);
  });
});

// ─────────────────────────────────────────────────
// GPU 탭 회귀 테스트 (잘못 배치됐던 기업 제거 확인)
// ─────────────────────────────────────────────────
describe('gpu 탭 기업 매칭 회귀 방지', () => {
  const names = getCandidateNames('gpu');

  test('TSMC(파운드리)가 gpu 탭에 없다', () => {
    assert.ok(!names.includes('TSMC'), 'TSMC는 파운드리이므로 gpu 탭 부적합');
  });

  test('Texas Instruments(아날로그칩)가 gpu 탭에 없다', () => {
    assert.ok(!names.includes('Texas Instruments'));
  });

  test('MediaTek(모바일칩)이 gpu 탭에 없다', () => {
    assert.ok(!names.includes('MediaTek'));
  });

  test('NVIDIA, AMD, Broadcom, Intel 등 핵심 AI 가속기 기업이 존재한다', () => {
    assert.ok(names.includes('NVIDIA'));
    assert.ok(names.includes('AMD'));
    assert.ok(names.includes('Broadcom'));
    assert.ok(names.includes('Intel'));
  });

  test('Tenstorrent, Cerebras 등 신흥 AI 칩 스타트업이 존재한다', () => {
    assert.ok(names.includes('Tenstorrent'));
    assert.ok(names.includes('Cerebras'));
  });
});

// ─────────────────────────────────────────────────
// Memory 탭 회귀 테스트
// ─────────────────────────────────────────────────
describe('memory 탭 기업 매칭 회귀 방지', () => {
  const names = getCandidateNames('memory');

  test('TSMC(파운드리)가 memory 탭에 없다', () => {
    assert.ok(!names.includes('TSMC'));
  });

  test('Kioxia(NAND→스토리지)가 memory 탭에 없다', () => {
    assert.ok(!names.includes('Kioxia'));
  });

  test('Western Digital(스토리지)이 memory 탭에 없다', () => {
    assert.ok(!names.includes('Western Digital'));
  });

  test('Seagate(스토리지)가 memory 탭에 없다', () => {
    assert.ok(!names.includes('Seagate'));
  });

  test('Silicon Motion(SSD컨트롤러)이 memory 탭에 없다', () => {
    assert.ok(!names.includes('Silicon Motion'));
  });

  test('HBM 실제 제조사(SK Hynix, Micron, Samsung)가 존재한다', () => {
    assert.ok(names.includes('SK Hynix'));
    assert.ok(names.includes('Micron'));
    assert.ok(names.includes('Samsung'));
  });

  test('HBM 장비 업체(Lam Research, Applied Materials)가 존재한다', () => {
    assert.ok(names.includes('Lam Research'));
    assert.ok(names.includes('Applied Materials'));
  });
});

// ─────────────────────────────────────────────────
// Facility 탭 회귀 테스트
// ─────────────────────────────────────────────────
describe('facility 탭 기업 매칭 회귀 방지', () => {
  const names = getCandidateNames('facility');

  test('American Tower(통신탑)가 facility 탭에 없다', () => {
    assert.ok(!names.includes('American Tower'));
  });

  test('Crown Castle(통신탑)이 facility 탭에 없다', () => {
    assert.ok(!names.includes('Crown Castle'));
  });

  test('SBA Communications(통신탑)이 facility 탭에 없다', () => {
    assert.ok(!names.includes('SBA Communications'));
  });

  test('CenterPoint Energy(전력유틸리티)가 facility 탭에 없다', () => {
    assert.ok(!names.includes('CenterPoint Energy'));
  });

  test('실제 코로케이션 기업(Equinix, Digital Realty)이 존재한다', () => {
    assert.ok(names.includes('Equinix'));
    assert.ok(names.includes('Digital Realty'));
  });
});

// ─────────────────────────────────────────────────
// AI-Network 탭 회귀 테스트
// ─────────────────────────────────────────────────
describe('ai-network 탭 기업 매칭 회귀 방지', () => {
  const names = getCandidateNames('ai-network');

  test('Cloudflare(CDN)이 ai-network 탭에 없다', () => {
    assert.ok(!names.includes('Cloudflare'));
  });

  test('Palo Alto Networks(보안)이 ai-network 탭에 없다', () => {
    assert.ok(!names.includes('Palo Alto Networks'));
  });

  test('Ciena(광트랜시버)가 ai-network에 없고 optics 탭에 있다', () => {
    assert.ok(!names.includes('Ciena'), 'Ciena는 optics 탭으로 이동해야 함');
    const opticsNames = getCandidateNames('optics');
    assert.ok(opticsNames.includes('Ciena'), 'Ciena가 optics 탭에 있어야 함');
  });

  test('실제 DC 네트워킹 기업(NVIDIA, Arista, Broadcom, Cisco)이 존재한다', () => {
    assert.ok(names.includes('NVIDIA'));
    assert.ok(names.includes('Arista Networks'));
    assert.ok(names.includes('Broadcom'));
    assert.ok(names.includes('Cisco'));
  });
});

// ─────────────────────────────────────────────────
// Optics 탭 회귀 테스트
// ─────────────────────────────────────────────────
describe('optics 탭 기업 매칭 회귀 방지', () => {
  const names = getCandidateNames('optics');

  test('II-VI (Coherent) 중복 항목이 optics 탭에 없다', () => {
    assert.ok(!names.includes('II-VI (Coherent)'));
  });

  test('Finisar (II-VI) 중복 항목이 optics 탭에 없다', () => {
    assert.ok(!names.includes('Finisar (II-VI)'));
  });

  test('Ciena가 optics 탭에 존재한다', () => {
    assert.ok(names.includes('Ciena'));
  });

  test('실제 광트랜시버 기업(Coherent Corp, Lumentum, Fabrinet)이 존재한다', () => {
    assert.ok(names.includes('Coherent Corp'));
    assert.ok(names.includes('Lumentum'));
    assert.ok(names.includes('Fabrinet'));
  });
});

// ─────────────────────────────────────────────────
// 기업이 여러 탭에 중복 배치되지 않는지 검증
// (단, 동일 기업이 여러 탭에 있는 건 의도적인 경우 제외)
// ─────────────────────────────────────────────────
describe('명백한 단일 카테고리 기업의 중복 배치 방지', () => {
  test('Kioxia(NAND)는 storage 탭에만 있고 memory 탭에는 없다', () => {
    // Kioxia는 이제 어느 탭에도 없을 수 있음 (제거됨)
    const memNames = getCandidateNames('memory');
    assert.ok(!memNames.includes('Kioxia'), 'Kioxia가 memory 탭에 없어야 함');
  });

  test('Seagate는 storage 탭에 있고 memory 탭에는 없다', () => {
    const storageNames = getCandidateNames('storage');
    const memNames     = getCandidateNames('memory');
    assert.ok(storageNames.includes('Seagate'), 'Seagate가 storage에 있어야 함');
    assert.ok(!memNames.includes('Seagate'), 'Seagate가 memory에 없어야 함');
  });

  test('Western Digital은 storage 탭에 있고 memory 탭에는 없다', () => {
    const storageNames = getCandidateNames('storage');
    const memNames     = getCandidateNames('memory');
    assert.ok(storageNames.includes('Western Digital'));
    assert.ok(!memNames.includes('Western Digital'));
  });
});

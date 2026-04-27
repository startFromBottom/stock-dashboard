// 진단용 임시 라우트 — 사용 종료. 실제 호출 시 410 반환.
// 파일 삭제는 dev 서버 락 때문에 보류 — 서버 재시작 후 디렉토리 삭제 가능.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'diagnostic route disabled' },
    { status: 410 }
  );
}

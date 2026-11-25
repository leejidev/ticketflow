const supabase = require("../lib/supabase");

// [과제 1] 공연 목록 조회
async function getPerformances(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("performances")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return res.status(200).json(data ?? []);
  } catch (error) {
    next(error);
  }
}

// [과제 2] 공연 등록
async function createPerformance(req, res, next) {
  try {
    // TODO 2-1. 요청 Body에서 공연 정보 가져오기
    // TODO 2-2. 필수값 확인
    // TODO 2-3. Supabase에 데이터 등록
    // TODO 2-4. 등록 결과 반환

    return res.status(501).json({
      error: "공연 등록 기능을 구현해 주세요.",
    });
  } catch (error) {
    next(error);
  }
}

// [과제 3] 공연 수정
async function updatePerformance(req, res, next) {
  try {
    // TODO 3-1. 요청 URL에서 id 가져오기
    // TODO 3-2. 수정할 공연 정보 가져오기
    // TODO 3-3. 입력값 검증
    // TODO 3-4. Supabase 데이터 수정
    // TODO 3-5. 수정 결과 반환

    return res.status(501).json({
      error: "공연 수정 기능을 구현해 주세요.",
    });
  } catch (error) {
    next(error);
  }
}

// [과제 4] 공연 삭제
async function deletePerformance(req, res, next) {
  try {
    // TODO 4-1. 요청 URL에서 id 가져오기
    // TODO 4-2. Supabase 데이터 삭제
    // TODO 4-3. 삭제 결과 반환

    return res.status(501).json({
      error: "공연 삭제 기능을 구현해 주세요.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
};

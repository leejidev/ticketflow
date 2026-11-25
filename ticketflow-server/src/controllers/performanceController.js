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
    const { title, venue, starts_at, price } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title은 비어 있지 않은 문자열이어야 합니다." });
    }
    if (typeof venue !== "string" || !venue.trim()) {
      return res.status(400).json({ error: "venue는 비어 있지 않은 문자열이어야 합니다." });
    }
    if (!Number.isInteger(price) || price < 0) {
      return res.status(400).json({ error: "price는 0 이상의 정수여야 합니다." });
    }

    // Require an ISO date-time with a timezone and reject calendar overflow.
    const dateParts = typeof starts_at === "string"
      ? /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(starts_at)
      : null;
    const calendarDate = dateParts
      ? new Date(dateParts[1] + "-" + dateParts[2] + "-" + dateParts[3] + "T00:00:00Z")
      : null;
    if (
      !dateParts ||
      Number.isNaN(Date.parse(starts_at)) ||
      calendarDate.getUTCFullYear() !== Number(dateParts[1]) ||
      calendarDate.getUTCMonth() + 1 !== Number(dateParts[2]) ||
      calendarDate.getUTCDate() !== Number(dateParts[3])
    ) {
      return res.status(400).json({
        error: "starts_at은 시간대가 포함된 유효한 ISO 날짜·시간이어야 합니다.",
      });
    }

    const { data, error } = await supabase
      .from("performances")
      .insert({ title: title.trim(), venue: venue.trim(), starts_at, price })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      message: "공연 등록 완료",
      performance: data,
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

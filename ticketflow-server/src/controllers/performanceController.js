const supabase = require("../lib/supabase");

function isValidPerformanceDate(starts_at) {
  // 시간대가 포함된 ISO 날짜·시간 형식인지 확인하고, 존재하지 않는 날짜는 거부합니다.
  const dateParts = typeof starts_at === "string"
    ? /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(starts_at)
    : null;
  const calendarDate = dateParts
    ? new Date(dateParts[1] + "-" + dateParts[2] + "-" + dateParts[3] + "T00:00:00Z")
    : null;
  return Boolean(dateParts) &&
    !Number.isNaN(Date.parse(starts_at)) &&
    calendarDate.getUTCFullYear() === Number(dateParts[1]) &&
    calendarDate.getUTCMonth() + 1 === Number(dateParts[2]) &&
    calendarDate.getUTCDate() === Number(dateParts[3]);
}

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

    if (!isValidPerformanceDate(starts_at)) {
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
    const { id } = req.params;
    const performanceId = Number(id);
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(performanceId) || performanceId <= 0) {
      return res.status(400).json({ error: "공연 ID는 양의 정수여야 합니다." });
    }

    const updates = req.body || {};
    if (typeof updates !== "object" || Array.isArray(updates)) {
      return res.status(400).json({ error: "수정할 정보는 객체여야 합니다." });
    }

    const updateData = {};
    for (const field of ["title", "venue", "starts_at", "price"]) {
      if (!Object.prototype.hasOwnProperty.call(updates, field)) {
        continue;
      }
      const value = updates[field];
      if (field === "title" || field === "venue") {
        if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({ error: field + "은 비어 있지 않은 문자열이어야 합니다." });
        }
        updateData[field] = value.trim();
      } else if (field === "starts_at") {
        if (!isValidPerformanceDate(value)) {
          return res.status(400).json({
            error: "starts_at은 시간대가 포함된 유효한 ISO 날짜·시간이어야 합니다.",
          });
        }
        updateData[field] = value;
      } else {
        if (!Number.isInteger(value) || value < 0) {
          return res.status(400).json({ error: "price는 0 이상의 정수여야 합니다." });
        }
        updateData[field] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "수정할 항목이 없습니다." });
    }

    const { data, error } = await supabase
      .from("performances")
      .update(updateData)
      .eq("id", performanceId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: "공연을 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "공연 수정 완료",
      performance: data,
    });
  } catch (error) {
    next(error);
  }
}

// [과제 4] 공연 삭제
async function deletePerformance(req, res, next) {
  try {
    const { id } = req.params;
    const performanceId = Number(id);
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(performanceId) || performanceId <= 0) {
      return res.status(400).json({ error: "공연 ID는 양의 정수여야 합니다." });
    }

    const { data, error } = await supabase
      .from("performances")
      .delete()
      .eq("id", performanceId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: "공연을 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "공연 삭제 완료" });
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

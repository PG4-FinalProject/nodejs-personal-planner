const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const isSameDate = require('../utils/isSameDate');

const getStatistics = (req, res) => {
  const decodedJWT = req.decodedJWT;
  const { currentTime } = req.body;

  const currentDateTime = new Date(currentTime);
  let currentDay = currentDateTime.getDay();
  if (currentDay === 0) currentDay = 7;

  let sql = `SELECT 
    selected_plan.id, title, detail, 
    start_time AS startTime, end_time AS endTime, color, 
    category.id AS categoryId, category.name AS categoryName
    FROM (SELECT * FROM plan WHERE user_id = ? 
    AND DATEDIFF(DATE( ? ), DATE(end_time)) <= ?
    AND DATEDIFF(DATE(start_time), DATE( ? )) <= ?) 
    AS selected_plan LEFT JOIN category 
    ON category_id=category.id
    ORDER BY start_time`;
  let values = [
    decodedJWT.id,
    currentTime,
    currentDay - 1,
    currentTime,
    -(currentDay - 7),
  ];
  conn.query(sql, values, (err, weekPlans) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '통계 목록 조회 실패',
      });
    }

    const result = {
      dailyStatistics: {
        totalCount: 0,
        toDoCount: 0,
        completedCount: 0,
      },
      weeklyStatistics: {
        totalCount: 0,
        toDoCount: 0,
        completedCount: 0,
      },
      weeklyCategoryStatisticsArr: [],
    };
    const {
      dailyStatistics, //
      weeklyStatistics,
      weeklyCategoryStatisticsArr,
    } = result;

    weekPlans.map(plan => {
      const startDateTime = new Date(plan.startTime);
      const endDateTime = new Date(plan.endTime);

      weeklyStatistics.totalCount++;
      if (currentDateTime < endDateTime) {
        weeklyStatistics.toDoCount++;
        if (isSameDate(currentDateTime, endDateTime)) {
          dailyStatistics.totalCount++;
          dailyStatistics.toDoCount++;
        }
        let isPlanInCategory = 0;
        weeklyCategoryStatisticsArr.map(category => {
          if (category.id && category.id === plan.categoryId) {
            category.totalCount++;
            category.toDoCount++;
            isPlanInCategory = 1;
            return;
          }
        });
        if (!isPlanInCategory) {
          weeklyCategoryStatisticsArr.push({
            id: plan.categoryId,
            name: plan.categoryName,
            totalCount: 1,
            toDoCount: 1,
            completedCount: 0,
          });
        }
      } else {
        weeklyStatistics.completedCount++;
        if (isSameDate(currentDateTime, endDateTime)) {
          dailyStatistics.totalCount++;
          dailyStatistics.completedCount++;
        }
        let isPlanInCategory = 0;
        weeklyCategoryStatisticsArr.map(category => {
          if (category.id && category.id === plan.categoryId) {
            category.totalCount++;
            category.completedCount++;
            isPlanInCategory = 1;
            return;
          }
        });
        if (!isPlanInCategory) {
          weeklyCategoryStatisticsArr.push({
            id: plan.categoryId,
            name: plan.categoryName,
            totalCount: 1,
            toDoCount: 0,
            completedCount: 1,
          });
        }
      }
    });

    weeklyCategoryStatisticsArr.sort((c1, c2) => c2.totalCount - c1.totalCount);

    return res.status(StatusCodes.OK).json(result);
  });
};

module.exports = {
  getStatistics,
};

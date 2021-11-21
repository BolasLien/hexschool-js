let data = [] // 前端工程師薪資資料

/**
 * 把整理好的資料做成 c3.js 接受的格式
 * @param { object } origin 輸入格式為 { data1:30, data2:10, data3:20 ... }
 * @returns 回傳 [['data1', 30], ['data2', 10], ['data3', 20] ...]
 */
function formatDataToC3(origin) {
  let chartData = []

  Object.keys(origin).forEach(item => {
    if(Array.isArray(origin[item])) {
      chartData.push([item, ...origin[item]])
    } else {
      chartData.push([item, origin[item]])
    }
  })

  return chartData
}

// 一條長條圖：接案公司的薪資滿意度
function createCaseCompanyChart() {
  // 篩選接案公司薪資滿意度資料
  let caseCompany = {}
  data.forEach(item => {
    if (item.company.industry.includes('接案')) {
      if(!caseCompany[item.company.salary_score]){
        caseCompany[item.company.salary_score] = []
      }

      caseCompany[item.company.salary_score]++
    }
  })

  // 整理接案公司薪資滿意度：1分~10分各有幾個人
  let caseCompanySalaryScore = {'接案':[]}
  let scoreKeys = Object.keys(caseCompany)
  scoreKeys.forEach(score=>{
    caseCompanySalaryScore['接案'].push(caseCompany[score])
  })
  // console.log(caseCompanySalaryScore);

    // 繪製長條圖
    c3.generate({
      bindto: '#salary-score',
      data: {
        columns: formatDataToC3(caseCompanySalaryScore),
        type: 'bar',
      },
      axis: {
        x: {
          type: 'category',
          categories: scoreKeys,
          label: '分數'
        },
        y: {
          label: '人數'
        },
      },
    })
}

// 二條長條圖：抓取博弈、電商公司兩個產業滿意度的平均分數
function createIndustryAvgScoreChart() {
  let companyData = {}
  // 篩選博弈、電商公司產業滿意度資料
  data.forEach(item => {
    if (item.company.industry.includes('博奕') || item.company.industry.includes('博弈')) {
      if(!companyData['博弈']) {
        companyData['博弈'] = []
      }

      companyData['博弈'].push(item.company.score)
    }

    if (item.company.industry.includes('電商') || item.company.industry.includes('電子商務')) {
      if(!companyData['電商']) {
        companyData['電商'] = []
      }

      companyData['電商'].push(item.company.score)
    }
  })

  // 整理博弈、電商公司產業滿意度平均分數
  let avgIndustryScoreData = {'博弈': 0, '電商': 0}
  Object.keys(avgIndustryScoreData).forEach(item=>{
    companyData[item].forEach(score=>{
      avgIndustryScoreData[item] += parseInt(score)
    })
    avgIndustryScoreData[item] = (avgIndustryScoreData[item] / companyData[item].length).toFixed(2)
  })

  // 繪製長條圖
  c3.generate({
    bindto: '#industry-avg-score',
    data: {
      columns: formatDataToC3(avgIndustryScoreData),
      type: 'bar',
    },
    axis: {
      x: {
        label: '產業'
      },
      y: {
        label: '平均分數'
      },
    },
  })
}

// 圓餅圖：撈取男性跟女性比例有多少
function createGenderRateChart() {
  // 整理男性跟女性人數
  let genderData = {'男性': 0, '女性': 0}
  data.forEach(item => {
    if (item.gender === '男性') {
      genderData['男性']++
    } else {
      genderData['女性']++
    }
  })

  // 繪製圓餅圖
  c3.generate({
    bindto: '#gender-rate',
    data: {
      columns: formatDataToC3(genderData),
      type: 'pie',
    },
  })
}

// 圓餅圖：顯示薪水區間分佈
function createSalaryDistributionChart() {
  // 整理薪水資料
  let salaryData = {}
  data.forEach(item => {
    if (!salaryData[item.company.salary]) {
      salaryData[item.company.salary] = 0
    }

    salaryData[item.company.salary]++
  })

  // 繪製圓餅圖
  c3.generate({
    bindto: '#salary-distribution',
    data: {
      columns: formatDataToC3(salaryData),
      type: 'pie',
    },
  })
}

axios
  .get(
    'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW'
  )
  .then(res => {
    data = res.data
    createCaseCompanyChart()
    createIndustryAvgScoreChart()
    createGenderRateChart()
    createSalaryDistributionChart()
  })
  .catch(err => {
    console.log(err)
  })
import React from 'react'
import ReactDom from 'react-dom'

const STANDARD_DEDUCTION = 12600
const EXEMPTION = 4050
const INCOME_TAX_PREMIUM = 0.022
const AVERAGE_HEALTHCARE_COST = 4955 + 1318

const CURRENT = Symbol()
const FUTURE = Symbol()

const RATES = {
  [CURRENT]: [{
    maxIncome: 9275,
    rate: 0.1
  }, {
    maxIncome: 37650,
    rate: 0.15
  }, {
    maxIncome: 91150,
    rate: 0.25
  }, {
    maxIncome: 190150,
    rate: 0.28
  }, {
    maxIncome: 413350,
    rate: 0.33
  }, {
    maxIncome: 415050,
    rate: 0.35
  }, {
    rate: 0.396
  }],
  [FUTURE]: [{
    maxIncome: 9275,
    rate: 0.1 + INCOME_TAX_PREMIUM
  }, {
    maxIncome: 37650,
    rate: 0.15 + INCOME_TAX_PREMIUM
  }, {
    maxIncome: 91150,
    rate: 0.25 + INCOME_TAX_PREMIUM
  }, {
    maxIncome: 190150,
    rate: 0.28 + INCOME_TAX_PREMIUM
  }, {
    maxIncome: 250000,
    rate: 0.33 + INCOME_TAX_PREMIUM
  }, {
    maxIncome: 500000,
    rate: 0.37
  }, {
    maxIncome: 2000000,
    rate: 0.43
  }, {
    maxIncome: 10000000,
    rate: 0.48
  }, {
    rate: 0.52
  }]
}

function totalTaxes (type, totalIncome, exemptions) {
  let taxableIncome = totalIncome - STANDARD_DEDUCTION - (exemptions * EXEMPTION)
  let taxes = 0
  let taxedIncome = 0
  for (let {maxIncome, rate} of RATES[type]) {
    if (taxedIncome !== taxableIncome) {
      let incomeInThisBracket

      if (maxIncome) {
        incomeInThisBracket = Math.min(maxIncome, taxableIncome) - taxedIncome
      } else {
        incomeInThisBracket = taxableIncome - taxedIncome
      }

      taxes += incomeInThisBracket * rate
      taxedIncome += incomeInThisBracket
    }
  }
  return Math.max(taxes, 0)
}

class App extends React.Component {
  constructor () {
    super()
    this.state = { income: 50000, exemptions: 4, healthcare: AVERAGE_HEALTHCARE_COST }
  }
  render () {
    let { income, exemptions, healthcare, advanced } = this.state

    let setIncome = e => this.setState({income: e.target.value})
    let setExemptions = e => this.setState({exemptions: e.target.value})
    let setHealthcare = e => this.setState({healthcare: e.target.value})
    let toggleAdvanced = () => this.setState({advanced: !advanced})

    let additionalTax = Math.round((totalTaxes(FUTURE, income, exemptions) - totalTaxes(CURRENT, income, exemptions)) * 100) / 100
    let costDelta = healthcare - additionalTax

    return <div>
      Household income<br/>
      <input type="number" value={ income } onChange={ setIncome }></input><br/>
      Number of exemptions<br/>
      <input type="number" value={ exemptions } onChange={ setExemptions }></input><br/>
      Current healthcare premiums and deductibles<br/>
      <input type="number" value={ healthcare } onChange={ setHealthcare }></input><br/>
      ${ AVERAGE_HEALTHCARE_COST } is the national average.<br/>
      { costDelta >= 0 ? <div>
        ${ costDelta } saved each year
      </div> : <div>
        ${ -costDelta } in additional costs each year
      </div> }
    </div>
  }
}

ReactDom.render(<App></App>, document.getElementById('app'))
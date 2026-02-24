// calculator.js - USDA Eligibility Calculator
class USDACalculator {
    constructor(formId, resultsId) {
        this.form = document.getElementById(formId);
        this.results = document.getElementById(resultsId);
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.calculate(e));
    }

    async calculate(e) {
        e.preventDefault();
        
        const btn = this.form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        btn.disabled = true;

        const formData = {
            state: this.form.state?.value || 'TX',
            county: this.form.county?.value || 'harris',
            hhSize: parseInt(this.form.householdSize?.value) || 4,
            income: parseFloat(this.form.income?.value) || 65000,
            elderly: this.form.elderly?.value === 'yes',
            childcare: parseFloat(this.form.childcare?.value) || 0,
            address: this.form.address?.value || '77001'
        };

        const zipMatch = formData.address.match(/\b\d{5}\b/);
        const zip = zipMatch ? zipMatch[0] : '77001';

        try {
            const [incomeData, propertyData] = await Promise.all([
                API.getIncomeLimits(formData.state, formData.county, formData.hhSize),
                API.checkProperty(zip)
            ]);

            this.displayResults(formData, incomeData, propertyData);
            API.saveLead('', '', '', formData.state, formData.county, 'calculator');

        } catch (error) {
            console.error('Calculator error:', error);
            alert('Sorry, there was an error. Please try again.');
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
    }

    displayResults(formData, incomeData, propertyData) {
        if (!this.results) return;

        let adjustedIncome = formData.income;
        if (formData.elderly) adjustedIncome -= 525;
        if (formData.childcare > 0) adjustedIncome -= Math.min(formData.childcare, 3000);

        const directLimit = incomeData.limit || 101500;
        const guaranteedLimit = directLimit * 1.35;
        const propertyEligible = propertyData.eligible !== false;

        const badge = document.getElementById('eligibilityBadge');
        if (badge) {
            badge.className = `eligibility-badge ${(adjustedIncome <= directLimit || adjustedIncome <= guaranteedLimit) && propertyEligible ? 'eligible' : 'not-eligible'}`;
            badge.innerHTML = (adjustedIncome <= directLimit || adjustedIncome <= guaranteedLimit) && propertyEligible ?
                '<i class="fas fa-check-circle"></i> You qualify for USDA loans!' :
                '<i class="fas fa-times-circle"></i> Not eligible based on income or property';
        }

        const grid = document.getElementById('resultsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="result-card">
                    <div class="result-label">Direct Loan Limit</div>
                    <div class="result-value">$${directLimit.toLocaleString()}</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Guaranteed Limit</div>
                    <div class="result-value">$${guaranteedLimit.toLocaleString()}</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Your Income</div>
                    <div class="result-value">$${adjustedIncome.toLocaleString()}</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Property</div>
                    <div class="result-value">${propertyEligible ? '✅ Eligible' : '❌ Not Eligible'}</div>
                </div>
            `;
        }

        const rec = document.getElementById('programRecommendation');
        if (rec) {
            rec.innerHTML = adjustedIncome <= directLimit && propertyEligible ?
                '<i class="fas fa-star"></i> You qualify for Direct USDA loans with rates as low as 1%!' :
                adjustedIncome <= guaranteedLimit && propertyEligible ?
                '<i class="fas fa-star"></i> You qualify for Guaranteed USDA loans with 0% down!' :
                '<i class="fas fa-info-circle"></i> Consider FHA (3.5% down) or Conventional loans.';
        }

        this.results.style.display = 'block';
        this.results.scrollIntoView({ behavior: 'smooth' });
    }

    reset() {
        if (this.results) this.results.style.display = 'none';
        if (this.form) this.form.reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new USDACalculator('eligibilityForm', 'results');
});

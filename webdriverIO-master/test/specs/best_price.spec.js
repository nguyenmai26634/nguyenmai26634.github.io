const Bestprice = require('../pages/best_price.page')
const bestPriceData = require('./best_price')

describe('Bestprice', () => {

    it('Bestprice search', async () => {
        // 1. Vào https://www.bestprice.vn/
        await browser.url(Bestprice.urlBestPrice)
        
        // 2. Thực hiện search vé
        await Bestprice.search(bestPriceData.diemdi, bestPriceData.diemden , bestPriceData.toDate, bestPriceData.fromDate)

        // 3. Kiểm tra màn hình danh sách vé
        // 3.1. Kiểm tra ngày đến, ngày đi 
        await expect($(Bestprice.xpathTextCenter())).toHaveTextContaining(bestPriceData.textCenter1)
        await expect($(Bestprice.xpathTextCenter(2))).toHaveTextContaining(bestPriceData.textCenter2)    
        //  3.2. Kiểm tra hiển thị đầy đủ danh sách vé
        let flightCodeExp = [];
        flightCodeExp=await Bestprice.checkAPIResponse(bestPriceData.diemdi, bestPriceData.from_code, bestPriceData.diemden,
            bestPriceData.to_code,bestPriceData.departDate, bestPriceData.returnDate)
        
        let flightCodeActual = [];
        const flightCodeAmount = await $$(Bestprice.xpathFlightCode).length;

        for (let i = 1; i < flightCodeAmount +1; i++) {
            let flightCode =await $(Bestprice.xpathFlight(i));
            flightCodeActual.push(await flightCode.getText());
          }
    
        expect(flightCodeExp).toEqual(flightCodeActual);

    })
})
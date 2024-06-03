const { default: axios } = require("axios");

class Bestprice {
  async checkMessage(msg) {
    await expect(this.loginMessage).toHaveTextContaining(msg);
  }

  urlBestPrice = "https://www.bestprice.vn/";
  xpathDiemdi = `//input[@placeholder="Chọn điểm đi"]`;
  xpathSearchDiemdi =
    '(//input[@placeholder="Mã sân bay, Tên sân bay, Tên thành phố..."])[1]';
  xpathDiemden = `//input[@placeholder="Chọn điểm đến"]`;
  xpathSearchDiemden =
    '(//input[@placeholder="Mã sân bay, Tên sân bay, Tên thành phố..."])[2]';
  xpathTimKiem = '//button[contains(text(), "Tìm chuyến bay")]';
  xpathToDate = '//input[@id="departure_date_flight"]';
  xpathFromDate = '//input[@id="returning_date_flight"]';
  xpathHanhkhach = '(//input[@data-title="Chọn số người"])[1]';
  xpathPassenger = '(//div[@class="search-form__content__pass__input"])[1]';
  xpathChildPlus ='(//div[@data-field="nb_children" and @data-type="plus"])[3]';
  xpathFlightCode ='//div[@class="margin-left-3 list-flight-code"]/span[@class="flight-code"]';
  xpathValue= '//input[@placeholder="Chọn điểm đi"]';

  /**
   * @param {string} diemdi
   * @returns {string}
   */
  xpathDiemdiValue(diemdi) {
    return `(//li[@value='${diemdi}'])[1]`;
  }

  /**
   * @param {string} diemden
   * @returns {string}
   */
  xpathDiemdenValue(diemden) {
    return `(//li[@value='${diemden}'])[2]`;
  }

  /**
   * @param {string} date
   * @returns {string}
   */
  xpathPickDate(date) {
    return `//a//span[contains(@class,'${date}')]`;
  }

  xpathTextCenter(index = 1) {
    return `(//div[@dayindex="0"]//div[@class="week-day text-center"])[${index}]`;
  }
  

  /**
   *  filght code
   /**
   * @param {number} index
   * @returns {string}
   */
  xpathFlight(index) {
    return `(//div[@class="margin-left-3 list-flight-code"]/span[@class="flight-code"])[${index}]`;
  }

  /**
   * Click on any button link
   /**
   * @param {string} className
   * @returns {string}
   */
    async clickOnBtnLinkWithClass(className, index = 1) {
      const xpath = `(//div[contains(@class, '${className}') and contains(@type, 'button')])[${index}]`;
      await this.locator(xpath).scrollIntoViewIfNeeded();
      await this.click(xpath);
    }

  
  // * wait until
  /**
   * @param {string} xpath
   * @param {number} timeout
   */
  async waitUntil(xpath, timeout) {
    const xpathWait = await $(this.xpath);
    await browser.waitUntil(
      async () =>
        (await xpathWait.isDisplayed()) && (await xpathWait.isEnabled()),
      {
        timeout: timeout,
        timeoutMsg: xpathWait + " is still not interactable after 10 seconds",
      }
    );
  }

  // * wait until
  /**
   * @param {string} xpath
   * @param {number} timeout
   */
  async waitUntilThenClick(xpath, timeout) {
    const xpathWait = await $(xpath);
    await browser.waitUntil(
      async () =>
        (await xpathWait.isDisplayed()) && (await xpathWait.isEnabled()),
      {
        timeout: timeout,
        timeoutMsg: xpathWait + " is still not interactable after 10 seconds",
      }
    );
    await xpathWait.click();
  }
  
  /**
   * Click on any button link
   /**
   * @param {string} selector
   * @returns {string}
   */
  
  async findDateElement() {
    const innerEl = (await $(this.xpathValue)).getElementShadowRoot();
    console.log(await innerEl.getText());

    return innerEl;
  }

  async search(diemdi, diemden, toDate, fromDate) {
    // find and click "Chọn điểm đi"
    const diemdiInput = await $(this.xpathDiemdi);
    await diemdiInput.click();
    await $(this.xpathSearchDiemdi).isExisting();

    // find and click value
    const diemdiValue = await $(this.xpathDiemdiValue(diemdi));
    await diemdiValue.click();
    await expect(await browser.$('//input[@placeholder="Chọn điểm đi"]').getValue()).toEqual(diemdi);
    // find and click "Chọn điểm đến"
    const diemdenInput = await $(this.xpathDiemden);
    await diemdenInput.click();
    await $(this.xpathSearchDiemden).isExisting();

    const xpathDiemden = this.xpathDiemdenValue(diemden);
    await this.waitUntilThenClick(xpathDiemden, 2000);
    await expect(await browser.$('//input[@placeholder="Chọn điểm đến"]').getValue()).toEqual(diemden);

    // Tìm và click vào input "Chọn ngày đi"
    const toDateInput = await $(this.xpathToDate);
    await toDateInput.click();

    // find and click value ngày đi dd-m
    const toDateValue = this.xpathPickDate(toDate);
    await this.waitUntilThenClick(toDateValue, 2000);

    // find and click "Chọn ngày đến"
    const fromDateInput = await $(this.xpathFromDate);
    await fromDateInput.click();
  

    // find and click fromdate value
    const fromDateValue = this.xpathPickDate(fromDate);
    await this.waitUntilThenClick(fromDateValue, 2000);

    //add Passenger
    const numberPassenger = await $(this.xpathPassenger);
    await numberPassenger.click();
    const childPlus = this.xpathChildPlus;
    await this.waitUntilThenClick(childPlus, 2000);
    await expect(await browser.$('//input[@class="CHD"]').getValue()).toEqual("1");

    // find and click "Tìm chuyến bay"
    const timKiemBtn = await $(this.xpathTimKiem);
    await timKiemBtn.click();
  }

  async checkAPIResponse(from, from_code, to, to_code, departDate, returnDate) {
    const flightTypes = ["depart", "return"];
    const airlineSearches = ["QH", "VJ", "VN", "VU"];
    let sumflightCode = 0;
    let dataFlightCode = [];

    for (const flightType of flightTypes) {
      for (const airline of airlineSearches) {
        const flightTypeParam = flightType;
        const airlineSearchParam = airline;

        const apiResponse = await axios.get(
          `https://www.bestprice.vn/ajax-search-flight-bp?Type=roundway&From=${from}&From_Code=${from_code}&To=${to}&To_Code=${to_code}&Depart=${departDate}&Return=${returnDate}&ADT=1&CHD=0&INF=0&Airline=&is_domistic=1&is_search_cheapest=0&sid=CE09083F10E1EF24A9E2B51BBB8531C01717178993&vnisc_sid=1717179087.50419.9e965dba&previous_flights=&flight_type=${flightTypeParam}&filter_airlines=&time_first_call=&airline_search=${airlineSearchParam}`
        );

        await expect(apiResponse.status).toBe(200);
        const data = await apiResponse.data;
        const flightCodeCount = data.search_data.flight_data.length;
        sumflightCode += flightCodeCount;
        for (let i = 0; i < flightCodeCount; i++) {
          dataFlightCode.push(data.search_data.flight_data[i].FlightCode);
        }
      }
    }
    return dataFlightCode;
  }
}
module.exports = new Bestprice();

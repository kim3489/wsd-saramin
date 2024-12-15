import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os


def crawl_saramin_company(keyword, pages=1, max_retries=3):
    companys = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for page in range(1, pages + 1):
        url = f"https://www.saramin.co.kr/zf_user/company-review/company-search?page={page}&recruitCheck=&order=favor&searchWord={keyword}&reviewTags=&revenue=&salary=&employees=&operatingRevenue=&startingSalary=&establishment=&netRevenue=&order=favor&service_comment="

        retry = 0
        while retry < max_retries:
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                company_listings = soup.select('.company_info')

                for company in company_listings:
                    try:
                        name = company.select_one('.title a').text.strip()

                        jobRecruiting = company.select_one('.title .link_employ span')
                        recruiting = jobRecruiting.text.strip() if jobRecruiting else '0'

                        companyInformation = company.select('.text_info span')
                        companyType = companyInformation[0].text.strip() if len(companyInformation) > 0 else ''
                        companyInform = companyInformation[1].text.strip() if len(companyInformation) > 1 else ''
                        companyDate = ''

                        if "기업" in companyInform:
                            companyDate = companyInformation[2].text.strip() if len(companyInformation) > 2 else ''
                        else:
                            companyDate = companyInform
                            companyInform = ''

                        companys.append({
                            'name': name,
                            'recruiting': recruiting,
                            'companyInform': companyInform,
                            'companyType': companyType,
                            'companyDate': companyDate,
                        })

                    except AttributeError as e:
                        print(f"항목 파싱 중 에러 발생: {e}")
                        continue

                print(f"{page}페이지 크롤링 완료")
                time.sleep(3)
                break

            except requests.RequestException as e:
                retry += 1
                print(f"페이지 요청 중 에러 발생: {e}")
                print(f"재시도 {retry}/{max_retries}회")
                time.sleep(5)

        if retry == max_retries:
            print(f"{page}페이지 요청이 {max_retries}회 실패하여 건너뜁니다.")

    return pd.DataFrame(companys)

if __name__ == "__main__":
    pages = 20
    df = crawl_saramin_company('주', pages)

    print(f"{pages}페이지 크롤링이 완료되었습니다. ")
    df.to_csv(os.path.join(os.getcwd(),'company.csv'), index=False)
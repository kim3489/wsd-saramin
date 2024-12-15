import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

def crawl_saramin(keyword, pages=1, max_retries=3):

    jobs = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for page in range(1, pages + 1):
        url = f"https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword={keyword}&recruitPage={page}&recruitSort=relation&recruitPageCount=100"

        retry = 0
        while retry < max_retries:
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                job_listings = soup.select('.item_recruit')

                for job in job_listings:
                    try:
                        company = job.select_one('.corp_name a').text.strip()

                        title = job.select_one('.job_tit a').text.strip()

                        link = 'https://www.saramin.co.kr' + job.select_one('.job_tit a')['href']

                        conditions = job.select('.job_condition span')
                        location = conditions[0].text.strip() if len(conditions) > 0 else ''
                        experience = conditions[1].text.strip() if len(conditions) > 1 else ''
                        education = conditions[2].text.strip() if len(conditions) > 2 else ''
                        employment_type = conditions[3].text.strip() if len(conditions) > 3 else ''

                        deadline = job.select_one('.job_date .date').text.strip()

                        job_sector = job.select_one('.job_sector')
                        sector = job_sector.text.strip() if job_sector else ''

                        jobs.append({
                            'company': company,
                            'title': title,
                            'link': link,
                            'location': location,
                            'experience': experience,
                            'education': education,
                            'employmentType': employment_type,
                            'deadline': deadline,
                            'sector': sector,
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

    return pd.DataFrame(jobs)

if __name__ == "__main__":
    df = crawl_saramin('채용 모집', pages=5)

    print(df)
    df.to_csv(os.path.join(os.getcwd(), 'job.csv'), index=False)
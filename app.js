// 데이터 파일 로드 및 검색 기능
let facilityData = [];

// JSON 데이터 로드
fetch("all.json") // JSON 파일 이름 확인: 필요 시 정확한 경로로 수정
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        facilityData = data;
        console.log("JSON 데이터가 성공적으로 로드되었습니다.", facilityData);
    })
    .catch(error => console.error("JSON 파일을 불러오는 중 오류 발생:", error));

// 검색 함수
function search() {
    const facilityType = document.getElementById("facility_type").value.trim();
    const district = document.getElementById("district").value.trim();
    const results = document.getElementById("results");

    // 결과 초기화
    results.innerHTML = "";

    // 데이터 유효성 확인
    if (!Array.isArray(facilityData) || facilityData.length === 0) {
        results.textContent = "데이터를 불러오지 못했습니다. 다시 시도해주세요.";
        console.error("facilityData가 유효하지 않음:", facilityData);
        return;
    }

    // 검색 필터링
    const filteredData = facilityData.filter(item => {
        const matchesType = !facilityType || item["체육시설종류"] === facilityType;
        const matchesDistrict = !district || (item["시군구"] && item["시군구"].includes(district));
        return matchesType && matchesDistrict;
    });

    // 결과 출력
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item["시설명"]} (${item["체육시설종류"]}) - ${item["시군구"]}`;
            results.appendChild(li);
        });
    } else {
        results.textContent = "검색 결과가 없습니다.";
    }
}

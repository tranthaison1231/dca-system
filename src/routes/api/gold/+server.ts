import { json } from "@sveltejs/kit";
import { last } from "lodash-es";
import dayjs from "dayjs";

export async function GET() {
  const dateRange = [
    dayjs().subtract(30, "day").format("DD/MM/YYYY"),
    dayjs().format("DD/MM/YYYY"),
  ];

  const res = await fetch(
    "https://bieudogiavang.vn/livewire/message/gold-pricing-chart",
    {
      headers: {
        accept: "text/html, application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": '"Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": "XgTlJwR3vIwgjw4Bdhqwh4mZEUUuZFpPcPNeLUkG",
        "x-livewire": "true",
        cookie:
          "XSRF-TOKEN=eyJpdiI6IjNvT0xnRHRNZ3VJWGVjaHBzTlVyL3c9PSIsInZhbHVlIjoiKy9DMTZHcnNRRllHZEhyQnd0cE0xV0JFY2tjMUtEbStxQy9PcDJqeUh6UDhHTS9CTWhvdThrQlRMc25jc2Y0Mlc2VXhrWFExN1FxZ1NmTU94U0pnQ3RzVDVoRTRIeU45SkQwb0ZpTGZuSU1zNXJVUVdHMGhHbTNLejltK0gwOTEiLCJtYWMiOiIyMDZmNDEzODVmMGVmODZkZmVjY2RkODc2NzExNmNhN2U2MDQ5OGIxNWFiNGFhOGY5MjhhOTQ1NDQ5MDIzYWJhIiwidGFnIjoiIn0%3D; bieu_do_gia_vang_session=eyJpdiI6IlFBT29kWmRKU1BrTHM3bWJJTUJlcVE9PSIsInZhbHVlIjoiKzVvWFVNSEkwb2oxWHFrdmRBK2NrZmdEZ2lqUlhON05rTitUT2xLWEwvdzRvSjVsL3YvT3JybDZ1UVN3Yjgzc245ZTNXS2Zmc0RyWGo2MmtjMmY2UEh3OWVsanl0OThhSDNvd0RhZW1QR3FUak1VSG9LamhlMnpBc0NZRy9LWmIiLCJtYWMiOiI5Nzc3YTZmZDcwY2M0ODk3MGVlZTZkMDM2YWJkOTUyZGIwNTRkZmYzNzg3YzQ1OGFiNDJkNGM5NjY5ZTFiNWJiIiwidGFnIjoiIn0%3D",
        Referer: "https://bieudogiavang.vn/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify({
        fingerprint: {
          id: "1qgXGSr56mrsGfzpTV0Y",
          name: "gold-pricing-chart",
          locale: "vn",
          path: "/",
          method: "GET",
          v: "acj",
        },
        serverMemo: {
          children: [],
          errors: [],
          htmlHash: "8eabb265",
          data: {
            assets: [],
            assetId: "56",
            data: null,
            showCompanyName: true,
            hasDateRangeFilter: false,
            dateRange: dateRange,
            title: "Biểu đồ giá vàng hôm nay",
            unit: "day",
          },
          dataMeta: {
            modelCollections: {
              assets: {
                class: "App\\Models\\Asset",
                id: [9, 36, 44, 43, 42, 41, 56, 57, 25],
                relations: ["company"],
                connection: "mysql",
                collectionClass: null,
              },
            },
          },
          checksum:
            "5561d2b3a684e45ce470c238a7cd5bb8d6f1bddc9043ee1ca205900a06a42c33",
        },
        updates: [
          {
            type: "syncInput",
            payload: {
              id: "nx29",
              name: "assetId",
              value: "41",
            },
          },
        ],
      }),
      method: "POST",
    },
  );
  console.log(res);
  const data = await res.json();
  const datasets = data?.effects?.emits[0]?.params?.[0]?.datasets;

  const buyPrices = datasets[1]?.data ?? [];
  const sellPrices = datasets[0]?.data ?? [];

  const sellingPrice: number = last(sellPrices)!;
  const sellingPriceChange30d =
    ((sellingPrice - sellPrices[0]) * 100) / sellPrices[0];
  const buyingPrice: number = last(buyPrices)!;
  const buyingPriceChange30d =
    ((buyingPrice - buyPrices[0]) * 100) / buyPrices[0];

  return json({
    status: "success",
    gold: {
      sellingPrice,
      sellingPriceChange30d: sellingPriceChange30d.toFixed(2),
      buyingPriceChange30d: buyingPriceChange30d.toFixed(2),
      buyingPrice,
    },
  });
}

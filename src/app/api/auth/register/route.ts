import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      message:
        "Прямая регистрация отключена. Отправьте заявку на бета-доступ через /apply и завершите регистрацию по invite-ссылке.",
    },
    { status: 403 }
  );
}
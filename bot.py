import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

# Bot token from user
TOKEN = "8507170837:AAH1Dz7WFTvfaehB0dZA99ZwFO-Y30nnviQ"

# Initialize bot and dispatcher
dp = Dispatcher()
bot = Bot(token=TOKEN)

# Configure logging
logging.basicConfig(level=logging.INFO)

@dp.message(Command("start"))
async def command_start(message: types.Message):
    """
    Send a message with a button that opens the Web App.
    """
    builder = InlineKeyboardBuilder()
    
    # IMPORTANT: You need to replace this URL with your actual hosted Web App URL
    # For testing, you can use a service like ngrok to tunnel your local server,
    # or host the files on GitHub Pages / Vercel / Netlify.
    # Example: "https://your-username.github.io/your-repo/webapp/index.html"
    web_app_url = "https://example.com/webapp/index.html" 
    
    builder.button(text="🚬 Открыть магазин", web_app=WebAppInfo(url=web_app_url))
    
    await message.answer(
        "Привет! Добро пожаловать в магазин табака.\nНажми на кнопку ниже, чтобы открыть каталог.",
        reply_markup=builder.as_markup()
    )

@dp.message(lambda message: message.web_app_data)
async def web_app_data_handler(message: types.Message):
    """
    Handle data sent from the Web App.
    """
    data = message.web_app_data.data
    await message.answer(f"Получен заказ:\n{data}")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Exit")

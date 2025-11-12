import os
from abc import ABC, abstractmethod
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import openpyxl

class InvoiceGenerator(ABC):
    def __init__(self, client_name, items):
        self.client_name = client_name
        self.items = items                   

    def calculate_total(self):
        return sum(item['price'] for item in self.items)

    @abstractmethod
    def generate_invoice(self):
        pass


class TaxMixin:
    def calculate_total(self):
        base = super().calculate_total()
        return round(base * 1.10, 2)


class PDFInvoiceGenerator(InvoiceGenerator, TaxMixin):
    def generate_invoice(self):
        folder = "invoices"
        os.makedirs(folder, exist_ok=True)
        filename = f"invoice_{self.client_name.lower().replace(' ', '_')}_{datetime.now():%Y%m%d_%H%M%S}.pdf"
        path = os.path.join(folder, filename)

        doc = SimpleDocTemplate(path, pagesize=A4, topMargin=70)
        styles = getSampleStyleSheet()
        story = []
        story.append(Paragraph("<b>INVOICE</b>", styles['Title']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Mijoz:</b> {self.client_name}", styles['Normal']))
        story.append(Spacer(1, 12))
        data = [["#", "Xizmat", "Narxi"]]
        for i, it in enumerate(self.items, 1):
            data.append([str(i), it['name'], f"${it['price']:.2f}"])

        total = self.calculate_total()
        data.append(["", "<b>Jami (10% QQS bilan)</b>", f"<b>${total:.2f}</b>"])

        table = Table(data, colWidths=[30, 350, 80])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('ALIGN', (2,1), (2,-1), 'RIGHT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ]))
        story.append(table)
        story.append(Spacer(1, 20))

        story.append(Paragraph(f"<i>Generatsiya vaqti: {datetime.now():%Y-%m-%d %H:%M:%S}</i>", styles['Normal']))

        doc.build(story)
        return path


class ExcelInvoiceGenerator(InvoiceGenerator, TaxMixin):
    def generate_invoice(self):
        folder = "invoices"
        os.makedirs(folder, exist_ok=True)
        filename = f"invoice_{self.client_name.lower().replace(' ', '_')}_{datetime.now():%Y%m%d_%H%M%S}.xlsx"
        path = os.path.join(folder, filename)

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["#", "Xizmat", "Narxi"])
        for i, it in enumerate(self.items, 1):
            ws.append([i, it['name'], it['price']])

        total = self.calculate_total()
        ws.append(["", "Jami (10% QQS bilan)", total])
        ws.append(["", "Generatsiya vaqti", datetime.now().strftime("%Y-%m-%d %H:%M:%S")])

        wb.save(path)
        return path


class HTMLInvoiceGenerator(InvoiceGenerator, TaxMixin):
    def generate_invoice(self):
        folder = "invoices"
        os.makedirs(folder, exist_ok=True)
        filename = f"invoice_{self.client_name.lower().replace(' ', '_')}_{datetime.now():%Y%m%d_%H%M%S}.html"
        path = os.path.join(folder, filename)

        total = self.calculate_total()
        lines = [
            "<!DOCTYPE html>",
            "<html><head><meta charset='utf-8'><title>Invoice</title></head><body>",
            f"<h2>INVOICE – {self.client_name}</h2>",
            "<ul>"
        ]
        for it in self.items:
            lines.append(f"<li>{it['name']}: ${it['price']:.2f}</li>")
        lines += [
            "</ul>",
            f"<p><strong>Jami (10% QQS bilan): ${total:.2f}</strong></p>",
            f"<p><i>Generatsiya: {datetime.now():%Y-%m-%d %H:%M:%S}</i></p>",
            "</body></html>"
        ]
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        return path


class InvoiceManager:
    def __init__(self, generator):
        self.generator = generator

    def export_invoice(self):
        file_path = self.generator.generate_invoice()
        print(f"Invoice yaratildi: {file_path}")

def get_generator(fmt, client_name, items):
    fmt = fmt.lower()
    if fmt == "pdf":   return PDFInvoiceGenerator(client_name, items)
    if fmt == "excel": return ExcelInvoiceGenerator(client_name, items)
    if fmt == "html":  return HTMLInvoiceGenerator(client_name, items)
    raise ValueError(f"Noma'lum format: {fmt}")


if __name__ == "__main__":
    data = {
        "client_name": "ABC Company",
        "items": [
            {"name": "Web dizayn", "price": 1200},
            {"name": "Logo yaratish", "price": 300},
            {"name": "SEO optimallashtirish", "price": 700}
        ]
    }
    for fmt in ["pdf", "excel", "html"]:
        gen = get_generator(fmt, **data)
        InvoiceManager(gen).export_invoice()  
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'custom-other-search',
  standalone: true,
  imports: [],
  templateUrl: './other-search.component.html',
  styleUrl: './other-search.component.scss',
})
export class OtherSearchComponent implements OnInit, OnDestroy {
  googleBaseUrl: string =
    'https://scholar.google.com/scholar?hl=en&as_sdt=0%2C33&inst=7210957415625843320';
  googleSearchUrl = '';
  ebscoBaseUrl: string =
    'https://research-ebsco-com.ezproxy.ithaca.edu/c/5mzcr3/search/results?';
  ebscoSearchUrl: string = '';
  ebscoSuffix: string =
    '&defaultdb=8gh%2Cahl%2Cair%2Caph%2Capn%2Casu%2Cbuh%2Cbwh%2Cbxh%2Ccin20%2Ccmedm%2Ccms%2Ce870sww%2Ceric%2Chch%2Chev%2Cibh%2Ckah%2Clfh%2Clxh%2Cmft%2Cmzh%2Cnfh%2Cnlebk%2Cpdh%2Cphl%2Cpsyh%2Cqth%2Creh%2Crft%2Crgr%2Cs3h%2Cser%2Csih%2Ctfh%2Ctrh%2C&auth-callid=0ad92c39-e993-42ad-9c3e-22c0d0466f14&skipResultsFetch=true&sqId=sq%3A273857da-97bf-4018-902e-1c53432a5a37';

  isHomepage = false;

  private lastQuery = '';
  private lastPathname = '';
  private pollHandle: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.checkQuery();
    // Poll for URL changes since we can't rely on ActivatedRoute here
    this.pollHandle = setInterval(() => this.checkQuery(), 500);
  }

  ngOnDestroy(): void {
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
    }
  }

  private checkQuery(): void {
    const pathname = window.location.pathname;
    if (pathname !== this.lastPathname) {
      this.lastPathname = pathname;
      this.isHomepage = pathname.includes('home');
    }
    const params = new URLSearchParams(window.location.search);
    const rawQuery = params.get('query') ?? '';
    if (rawQuery !== this.lastQuery) {
      this.lastQuery = rawQuery;
      this.convertToGoogle(rawQuery);
      this.convertToEbsco(rawQuery);
    }
  }

  private convertToGoogle(primoSearch: string): void {
    const googleSearchString = encodeURIComponent(primoSearch);
    this.googleSearchUrl = this.googleBaseUrl + '&q=' + googleSearchString;
  }

  private convertToEbsco(primoSearch: string): void {
    const ebscoSearchString = encodeURIComponent(primoSearch);
    this.ebscoSearchUrl =
      this.ebscoBaseUrl + 'q=' + ebscoSearchString + this.ebscoSuffix;
  }
}

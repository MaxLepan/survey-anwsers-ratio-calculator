# Survey Proportions Calculator

I quickly made this little web page to help calculate the proportions of responses needed to a survey.
It allows you to quickly see how many people need to be surveyed to get a good result, taking into account several parameters, such as the required number of answers, the male to female ratio and the number of answer per company (there is an option to calculate this automatically, making a ratio of the number of answers needed and the number of employees per company).

This was done for my final thesis, and I thought it might be useful to other people, in my class or elsewhere.

## How to use

You can use the web page by going to [this link]().

You can also clone this repository and open the `index.html` file in your browser.

First, you need to input the desired number of answers. This is the number of people you want to survey.

Then, you need to enter the men to woman ratio in the survey. This might need to be more precise, for exemple by precizing for each company the ratio, instead of having a general ratio.

You can also enter the number of answers per company, in case you want an equal number of answers per company. If you want a proportionnal number of answers per company, you can tick the "Determine automatically" checkbox (for exemple, if you have 2 companies, one with 75 employees and one with 25 employees, and you want 100 answers, you will get 75 answers for the first company and 25 for the second, instead of 50 for each).

You also need to precise the jobs you want to analyze. This is used later in the adding of companies.

You can then add companies by clicking the "Add company" button. You can choose the company's name and the number of people working in the jobs you want to analyze in this company.

Once you added every company you want, you can click the "Calculate proportions" button. This will show you the number of people you need to survey in each company.

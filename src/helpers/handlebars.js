const Handlebars = require ('handlebars');

module.exports = {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field == sort.column ? sort.type : 'default';


                const icons = {
                    default: 'bi bi-arrow-down-up',
                    asc: 'bi bi-arrow-up',
                    desc: 'bi bi-arrow-down',
                }
                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc'

                }

                const icon = icons[sortType];
                const type  = types[sortType];

                const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);

                const output = `<a href="${href}">
                        <i class="${icon}"></i>
                    </a>`;

                return new Handlebars.SafeString(output);
            }
        }
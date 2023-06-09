import { useState } from 'react'

/* Store */
import { useUpdateNoteMutation } from '../../../store/reducers/noteApi'

/* Styles */
import style from './EditNote.module.scss'

/* Icons */
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

/* Components */
import Input from '../../Standard/Input/Input'

/* Utils */
import { patternFilterTitle, patternNoteTitle } from '../../../utils/patterns'

export default function EditNote({ closeModal, note }) {
	const [form, setForm] = useState(note)
	const [filterInput, setFilterInput] = useState('')
	const [filterInputError, setFilterInputError] = useState(false)

	const [updateNote] = useUpdateNoteMutation()

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name === 'newFilter') {
			setFilterInput(value)
		} else {
			setForm((prev) => ({ ...prev, [name]: value }))
		}
	}

	const handleDeleteFilter = (name) => {
		const updatedFilters = form.filters.filter((f) => f !== name)
		setForm((prev) => ({ ...prev, filters: updatedFilters }))
	}

	const handleAddFilter = () => {
		const regex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ]{3,24}$/u
		if (regex.test(filterInput) === true) {
			console.log(filterInput)
			setForm((prev) => ({ ...prev, filters: [...prev.filters, filterInput] }))
			setFilterInput('')
			setFilterInputError(false)
			return
		} else {
			setFilterInputError(true)
			return
		}
	}

	const handleSubmitForm = (e) => {
		e.preventDefault()
		updateNote({ id: note._id, note: form })
		closeModal()
	}

	return (
		<form className={style.form} onSubmit={handleSubmitForm}>
			<Input
				required={true}
				label={'title'}
				name={'title'}
				value={form.title}
				pattern={patternNoteTitle}
				placeholder={'Enter the title'}
				errorMessage={'Wrong format'}
				onChange={handleChange}
				autoFocus={true}
				tooltip={'without number and spec symbols'}
			/>

			<div className={style.filters}>
				<div className={style.add}>
					<Input
						label={'New Filter'}
						name={'newFilter'}
						value={filterInput}
						pattern={patternFilterTitle}
						placeholder={'Enter the Filter'}
						onChange={handleChange}
						errorMessage={'Wrong format'}
						tooltip={'without number, space and spec symbols'}
					/>
					{filterInputError && <span className={style.add__error}>Filter cannot be empty</span>}
					<button type="button" className={style.add__btn} onClick={handleAddFilter}>
						<Icon icon={'plus'} />
						<span>Add new Filter</span>
					</button>
				</div>
				<ul className={style.filters__list}>
					{form.filters.map((filter, index) => (
						<li key={index} className={style.filters__item}>
							{filter}
							<div className={style.delete} onClick={() => handleDeleteFilter(filter)}>
								<Icon icon="minus" />
							</div>
						</li>
					))}
				</ul>
			</div>

			<button type="submit" className={style.add__note}>
				Edit Note
			</button>
		</form>
	)
}

